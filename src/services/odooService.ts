const BASE_URL = import.meta.env.VITE_ODOO_BASE_URL?.trim() || '/odoo-api';
const DB       = import.meta.env.VITE_ODOO_DB       || 'testcont1';
const USER     = import.meta.env.VITE_ODOO_USER     || 'admin';
const PASSWORD = import.meta.env.VITE_ODOO_PASSWORD || '1234';

// ── Auth ─────────────────────────────────────────────────────────────────────
async function authenticate(): Promise<void> {
  const res = await fetch(`${BASE_URL}/web/session/authenticate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      jsonrpc: '2.0', method: 'call', id: 1,
      params: { db: DB, login: USER, password: PASSWORD },
    }),
  });
  const data = await res.json();
  if (!data.result?.uid) throw new Error('No se pudo autenticar con Odoo.');
}

// ── RPC call ─────────────────────────────────────────────────────────────────
async function callKw<T>(
  model: string,
  method: string,
  args: unknown[],
  kwargs: Record<string, unknown> = {},
): Promise<T> {
  const res = await fetch(`${BASE_URL}/web/dataset/call_kw`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      jsonrpc: '2.0', method: 'call', id: 2,
      params: { model, method, args, kwargs },
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.data?.message || data.error.message || 'Error en Odoo');
  return data.result as T;
}

// ── Tipos ─────────────────────────────────────────────────────────────────────
export interface OdooOrderLine {
  name:  string;
  qty:   number;
  price: number;
}

export interface OdooQuoteData {
  customerName:  string;
  customerEmail: string;
  customerPhone: string;
  company:       string;
  service:       string;
  subService:    string;
  quantity:      number | string;
  months?:       number;
  estimate:      string;
  notes?:        string;
  orderLines?:   OdooOrderLine[];
}

export interface ContactFormData {
  nombre:    string;
  correo:    string;
  empresa:   string;
  mensaje:   string;
  telefono?: string;
}

// ── Reclutamiento ─────────────────────────────────────────────────────────────
export interface JobPosition {
  id:   number;
  name: string;
}

export interface JobApplicantData {
  nombre:   string;
  correo:   string;
  telefono: string;
  mensaje?: string;
  jobId?:   number;
  jobName?: string;
}

const ALLOWED_JOBS = [
  'Desarrollador con experiencia',
  'Inspector de control de calidad',
  'Director ejecutivo',
  'Consultor',
  'Gerente de recursos humanos',
  'Gerente de marketing y comunicación',
  'Aprendiz',
  'Técnico de mantenimiento',
  'Director técnico',
];

const normalize = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

export async function getJobPositions(): Promise<JobPosition[]> {
  await authenticate();
  const all = await callKw<JobPosition[]>(
    'hr.job', 'search_read',
    [[]],
    { fields: ['id', 'name'] },
  );
  return ALLOWED_JOBS
    .map(label => all.find(j => normalize(j.name) === normalize(label)))
    .filter((j): j is JobPosition => !!j);
}

export async function createJobApplicant(data: JobApplicantData): Promise<number> {
  await authenticate();

  // 0a. Resolver job_id: usar el provisto, buscar por nombre o crear hr.job si no existe
  let resolvedJobId = data.jobId;
  if (!resolvedJobId && data.jobName) {
    const existing = await callKw<JobPosition[]>(
      'hr.job', 'search_read',
      [[['name', '=ilike', data.jobName]]],
      { fields: ['id', 'name'], limit: 1 },
    );
    if (existing.length > 0) {
      resolvedJobId = existing[0].id;
    } else {
      resolvedJobId = await callKw<number>('hr.job', 'create', [{ name: data.jobName }]);
    }
  }

  // 0b. Obtener el stage_id de "Nuevo" (primera etapa del pipeline de reclutamiento)
  let newStageId: number | undefined;
  try {
    const stages = await callKw<{ id: number; name: string }[]>(
      'hr.recruitment.stage', 'search_read',
      [[['fold', '=', false]]],
      { fields: ['id', 'name'], limit: 1, order: 'sequence asc' },
    );
    if (stages.length > 0) newStageId = stages[0].id;
  } catch { /* best-effort */ }

  // 1. Crear candidato (hr.candidate)
  const candidateVals: Record<string, unknown> = {
    partner_name: data.nombre,
    email_from:   data.correo,
  };
  if (data.telefono) candidateVals.partner_phone = data.telefono;

  const candidateId = await callKw<number>('hr.candidate', 'create', [candidateVals]);

  if (!candidateId || typeof candidateId !== 'number') {
    throw new Error(`No se pudo crear el candidato (ID: ${candidateId})`);
  }

  const appVals: Record<string, unknown> = {
    candidate_id:  candidateId,
    partner_name:  data.nombre,
    email_from:    data.correo,
    partner_phone: data.telefono || false,
  };
  if (resolvedJobId) appVals.job_id          = resolvedJobId;
  if (newStageId)    appVals.stage_id         = newStageId;
  if (data.mensaje)  appVals.applicant_notes  = `<p>${data.mensaje}</p>`;

  const applicantId = await callKw<number>('hr.applicant', 'create', [appVals]);

  if (!applicantId || typeof applicantId !== 'number') {
    throw new Error(`No se pudo crear la postulación (ID: ${applicantId})`);
  }

  return candidateId;
}

// ── Cotización (calculadora de precio) ───────────────────────────────────────
export async function createOdooQuotation(quoteData: OdooQuoteData): Promise<number> {
  await authenticate();

  let partnerId: number;
  const existing = await callKw<number[]>('res.partner', 'search', [
    [['email', '=', quoteData.customerEmail]],
  ]);
  if (existing.length > 0) {
    partnerId = existing[0];
  } else {
    partnerId = await callKw<number>('res.partner', 'create', [{
      name:          quoteData.customerName,
      email:         quoteData.customerEmail,
      phone:         quoteData.customerPhone,
      company_name:  quoteData.company || undefined,
      customer_rank: 1,
    }]);
  }

  const note = [
    `<p><strong>── Datos del solicitante ──</strong></p>`,
    `<p><strong>Nombre:</strong> ${quoteData.customerName}</p>`,
    `<p><strong>Correo:</strong> ${quoteData.customerEmail}</p>`,
    quoteData.customerPhone ? `<p><strong>Teléfono:</strong> ${quoteData.customerPhone}</p>` : '',
    quoteData.company       ? `<p><strong>Empresa:</strong> ${quoteData.company}</p>` : '',
    `<p><strong>── Detalle del servicio ──</strong></p>`,
    `<p><strong>Servicio:</strong> ${quoteData.service}</p>`,
    `<p><strong>Sub-servicio:</strong> ${quoteData.subService}</p>`,
    `<p><strong>Cantidad:</strong> ${quoteData.quantity}</p>`,
    quoteData.months ? `<p><strong>Duración:</strong> ${quoteData.months} meses</p>` : '',
    `<p><strong>Estimación:</strong> ${quoteData.estimate}</p>`,
    quoteData.notes ? `<p><strong>Notas:</strong> ${quoteData.notes}</p>` : '',
  ].filter(Boolean).join('');

  const orderLines = (quoteData.orderLines ?? []).map(line => [0, 0, {
    name:            line.name,
    product_uom_qty: line.qty,
    price_unit:      line.price,
    product_id:      false,
  }]);

  return callKw<number>('sale.order', 'create', [{
    partner_id:       partnerId,
    client_order_ref: `Web - ${quoteData.service}`,
    note,
    order_line:       orderLines,
  }]);
}

// ── Contacto / Cotizador ──────────────────────────────────────────────────────
export async function createContactMessage(form: ContactFormData): Promise<number> {
  await authenticate();

  let partnerId: number;
  const existing = await callKw<number[]>('res.partner', 'search', [
    [['email', '=', form.correo]],
  ]);
  const partnerVals: Record<string, unknown> = {
    name:         form.nombre,
    email:        form.correo,
    phone:        form.telefono || false,
    company_name: form.empresa  || false,
  };

  if (existing.length > 0) {
    partnerId = existing[0];
    await callKw('res.partner', 'write', [[partnerId], partnerVals]);
  } else {
    partnerId = await callKw<number>('res.partner', 'create', [partnerVals]);
  }

  const description = [
    form.telefono ? `Teléfono: ${form.telefono}` : '',
    form.empresa  ? `Empresa: ${form.empresa}`   : '',
    '',
    form.mensaje,
  ].filter(Boolean).join('\n');

  // Crear lead CRM en lugar de sale.order para evitar campos de facturación
  return callKw<number>('crm.lead', 'create', [{
    name:         `Web - ${form.nombre}`,
    partner_id:   partnerId,
    contact_name: form.nombre,
    email_from:   form.correo,
    phone:        form.telefono || false,
    partner_name: form.empresa  || false,
    description,
  }]);
}

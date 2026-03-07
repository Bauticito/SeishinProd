const DEFAULT_LEADS_API_URL = 'https://seishin-media-api.seishin-media-api.workers.dev';

const API_BASE = (
  import.meta.env.VITE_LEADS_API_URL as string | undefined
)?.trim() || DEFAULT_LEADS_API_URL;

// ── API helpers ───────────────────────────────────────────────────────────────
type ContactPayload = {
  nombre: string;
  correo: string;
  empresa?: string;
  mensaje: string;
};

type QuotePayload = {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  company?: string;
  service: string;
  subService?: string;
  quantity?: string;
  estimate?: string;
  notes?: string;
};

async function parseResponse(response: Response): Promise<any> {
  const raw = await response.text();

  if (!raw) {
    if (response.ok) return {};
    throw new Error('El servidor no devolvio contenido');
  }

  let data: any;
  try {
    data = JSON.parse(raw);
  } catch {
    if (response.ok) return {};
    throw new Error(raw);
  }

  if (!response.ok) {
    throw new Error(data?.error || data?.message || 'Error al procesar la solicitud');
  }

  return data;
}

async function postLead(path: string, payload: Record<string, unknown>) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
}

export async function createContactMessage(data: ContactPayload) {
  return postLead('/api/leads/contact', {
    nombre: data.nombre,
    correo: data.correo,
    empresa: data.empresa || '',
    mensaje: data.mensaje,
  });
}

export async function createOdooQuotation(data: QuotePayload) {
  return postLead('/api/leads/quote', {
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    customerPhone: data.customerPhone || '',
    company: data.company || '',
    service: data.service,
    subService: data.subService || '',
    quantity: data.quantity || '',
    estimate: data.estimate || '',
    notes: data.notes || '',
  });
}

// ── Reclutamiento (Odoo directo) ──────────────────────────────────────────────
const ODOO_BASE = import.meta.env.VITE_ODOO_BASE_URL?.trim() || '/odoo-api';
const DB        = import.meta.env.VITE_ODOO_DB       || 'testcont1';
const ODOO_USER = import.meta.env.VITE_ODOO_USER     || 'admin';
const PASSWORD  = import.meta.env.VITE_ODOO_PASSWORD || '1234';

async function authenticate(): Promise<void> {
  const res = await fetch(`${ODOO_BASE}/web/session/authenticate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      jsonrpc: '2.0', method: 'call', id: 1,
      params: { db: DB, login: ODOO_USER, password: PASSWORD },
    }),
  });
  const data = await res.json();
  if (!data.result?.uid) throw new Error('No se pudo autenticar con Odoo.');
}

async function callKw<T>(
  model: string,
  method: string,
  args: unknown[],
  kwargs: Record<string, unknown> = {},
): Promise<T> {
  const res = await fetch(`${ODOO_BASE}/web/dataset/call_kw`, {
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

export async function getJobPositions(): Promise<JobPosition[]> {
  await authenticate();
  return callKw<JobPosition[]>(
    'hr.job', 'search_read',
    [[]],
    { fields: ['id', 'name'], order: 'name asc' },
  );
}

export async function createJobApplicant(data: JobApplicantData): Promise<number> {
  await authenticate();

  let resolvedJobId = data.jobId;
  if (!resolvedJobId && data.jobName) {
    const existing = await callKw<JobPosition[]>(
      'hr.job', 'search_read',
      [[['name', '=ilike', data.jobName]]],
      { fields: ['id', 'name'], limit: 1 },
    );
    if (existing.length > 0) resolvedJobId = existing[0].id;
  }

  let newStageId: number | undefined;
  try {
    const stages = await callKw<{ id: number; name: string }[]>(
      'hr.recruitment.stage', 'search_read',
      [[['fold', '=', false]]],
      { fields: ['id', 'name'], limit: 1, order: 'sequence asc' },
    );
    if (stages.length > 0) newStageId = stages[0].id;
  } catch { /* best-effort */ }

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
  if (resolvedJobId) appVals.job_id         = resolvedJobId;
  if (newStageId)    appVals.stage_id        = newStageId;
  if (data.mensaje)  appVals.applicant_notes = `<p>${data.mensaje}</p>`;

  const applicantId = await callKw<number>('hr.applicant', 'create', [appVals]);
  if (!applicantId || typeof applicantId !== 'number') {
    throw new Error(`No se pudo crear la postulación (ID: ${applicantId})`);
  }

  return candidateId;
}

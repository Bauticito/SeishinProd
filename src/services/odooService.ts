const DEFAULT_LEADS_API_URL = 'https://seishin-media-api.seishin-media-api.workers.dev';

const API_BASE = (
  import.meta.env.VITE_LEADS_API_URL as string | undefined
)?.trim() || DEFAULT_LEADS_API_URL;

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

export interface JobPosition {
  id: number;
  name: string;
}

export interface JobApplicantData {
  nombre: string;
  correo: string;
  telefono: string;
  mensaje?: string;
  jobId?: number;
}

export async function getJobPositions(): Promise<JobPosition[]> {
  const response = await fetch(`${API_BASE}/api/leads/recruitment/jobs`);
  const data = await parseResponse(response);
  return Array.isArray(data?.items) ? (data.items as JobPosition[]) : [];
}

export type OdooDocumentFile = {
  name: string;
  datas: string; // base64
  mimetype: string;
};

export async function uploadDocumentsToOdoo(
  files: OdooDocumentFile[],
  customerName?: string,
  folderName = 'Pagina Cotizaciones',
): Promise<void> {
  await postLead('/api/leads/documents', {
    files,
    folderName,
    customerName: customerName || '',
  });
}

export async function createJobApplicant(data: JobApplicantData): Promise<number> {
  const result = await postLead('/api/leads/recruitment', {
    nombre: data.nombre,
    correo: data.correo,
    telefono: data.telefono || '',
    mensaje: data.mensaje || '',
    jobId: data.jobId,
  });

  return Number(result?.leadId || 0);
}

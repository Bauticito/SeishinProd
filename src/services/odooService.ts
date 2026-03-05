const LEADS_API_BASE = import.meta.env.VITE_LEADS_API_URL?.trim() ?? "";

const buildUrl = (path: string): string => {
  if (!LEADS_API_BASE) return path;
  return `${LEADS_API_BASE.replace(/\/+$/, "")}${path}`;
};

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(buildUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as T & { error?: string };
  if (!res.ok) {
    const message = (data as { error?: string }).error ?? `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

export interface OdooOrderLine {
  name: string;
  qty: number;
  price: number;
}

export interface OdooQuoteData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  company: string;
  service: string;
  subService: string;
  quantity: number | string;
  months?: number;
  estimate: string;
  notes?: string;
  orderLines?: OdooOrderLine[];
}

type LeadApiResponse = {
  ok: boolean;
  leadId: number;
  syncStatus: "pending" | "synced" | "error";
  odooSaleOrderId?: number;
  message?: string;
};

export async function createOdooQuotation(quoteData: OdooQuoteData): Promise<number> {
  const response = await postJson<LeadApiResponse>("/api/leads/quote", quoteData);
  return response.odooSaleOrderId ?? response.leadId;
}

export interface ContactFormData {
  nombre: string;
  correo: string;
  empresa: string;
  mensaje: string;
}

export async function createContactMessage(form: ContactFormData): Promise<number> {
  const response = await postJson<LeadApiResponse>("/api/leads/contact", form);
  return response.odooSaleOrderId ?? response.leadId;
}

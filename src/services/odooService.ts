const LEADS_API_BASE =
  import.meta.env.VITE_LEADS_API_URL?.trim() ||
  "https://seishin-media-api.seishin-media-api.workers.dev";
const FALLBACK_WORKER_BASE = "https://seishin-media-api.seishin-media-api.workers.dev";

const buildUrl = (path: string): string => {
  if (!LEADS_API_BASE) return path;
  return `${LEADS_API_BASE.replace(/\/+$/, "")}${path}`;
};

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const endpoints = [buildUrl(path), `${FALLBACK_WORKER_BASE}${path}`].filter(
    (url, idx, arr) => arr.indexOf(url) === idx
  );

  let lastError = "Unknown request error";
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const text = await res.text();
      const data = text ? (JSON.parse(text) as T & { error?: string }) : ({} as T & { error?: string });

      if (!res.ok) {
        const message = (data as { error?: string }).error ?? `Request failed (${res.status})`;
        lastError = message;
        continue;
      }

      return data as T;
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Network error";
    }
  }

  throw new Error(lastError);
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

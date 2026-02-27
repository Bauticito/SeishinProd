const BASE_URL = import.meta.env.VITE_ODOO_BASE_URL || '/odoo-api';
const DB = import.meta.env.VITE_ODOO_DB || 'testcont1';
const USER = import.meta.env.VITE_ODOO_USER || 'admin';
const PASSWORD = import.meta.env.VITE_ODOO_PASSWORD || '1234';

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

async function authenticate(): Promise<void> {
  const res = await fetch(`${BASE_URL}/web/session/authenticate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'call',
      id: 1,
      params: { db: DB, login: USER, password: PASSWORD },
    }),
  });
  const data = await res.json();
  if (!data.result?.uid) {
    throw new Error('No se pudo autenticar con Odoo. Verifique las credenciales.');
  }
}

async function callKw<T>(
  model: string,
  method: string,
  args: unknown[],
  kwargs: Record<string, unknown> = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}/web/dataset/call_kw`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'call',
      id: 2,
      params: { model, method, args, kwargs },
    }),
  });
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error.data?.message || data.error.message || 'Error en Odoo');
  }
  return data.result as T;
}

export async function createOdooQuotation(quoteData: OdooQuoteData): Promise<number> {
  await authenticate();

  // Buscar partner existente por email o crear uno nuevo
  let partnerId: number;
  const existing = await callKw<number[]>('res.partner', 'search', [
    [['email', '=', quoteData.customerEmail]],
  ]);

  if (existing.length > 0) {
    partnerId = existing[0];
  } else {
    partnerId = await callKw<number>('res.partner', 'create', [
      {
        name: quoteData.customerName,
        email: quoteData.customerEmail,
        phone: quoteData.customerPhone,
        company_name: quoteData.company || undefined,
        customer_rank: 1,
      },
    ]);
  }

  // Armar nota HTML con los datos del solicitante
  const noteParts = [
    `<p><strong>── Datos del solicitante ──</strong></p>`,
    `<p><strong>Nombre:</strong> ${quoteData.customerName}</p>`,
    `<p><strong>Correo:</strong> ${quoteData.customerEmail}</p>`,
    quoteData.customerPhone ? `<p><strong>Teléfono:</strong> ${quoteData.customerPhone}</p>` : '',
    quoteData.company ? `<p><strong>Empresa:</strong> ${quoteData.company}</p>` : '',
    `<p><strong>── Detalle del servicio ──</strong></p>`,
    `<p><strong>Servicio:</strong> ${quoteData.service}</p>`,
    `<p><strong>Sub-servicio:</strong> ${quoteData.subService}</p>`,
    `<p><strong>Cantidad:</strong> ${quoteData.quantity}</p>`,
    quoteData.months ? `<p><strong>Duración:</strong> ${quoteData.months} meses</p>` : '',
    `<p><strong>Estimación:</strong> ${quoteData.estimate}</p>`,
    quoteData.notes ? `<p><strong>Notas:</strong> ${quoteData.notes}</p>` : '',
  ]
    .filter(Boolean)
    .join('');

  // Convertir líneas de precio al formato One2many de Odoo: [0, 0, {fields}]
  const orderLines = (quoteData.orderLines ?? []).map((line) => [
    0,
    0,
    {
      name: line.name,
      product_uom_qty: line.qty,
      price_unit: line.price,
      product_id: false,
    },
  ]);

  const orderId = await callKw<number>('sale.order', 'create', [
    {
      partner_id: partnerId,
      client_order_ref: `Web - ${quoteData.service}`,
      note: noteParts,
      order_line: orderLines,
    },
  ]);

  return orderId;
}

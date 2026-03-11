export interface Env {
  DB: D1Database;
  ADMIN_TOKEN?: string;
  CORS_ORIGIN?: string;
  ODOO_BASE_URL?: string;
  ODOO_DB?: string;
  ODOO_USER?: string;
  ODOO_PASSWORD?: string;
}

type MediaType = "image" | "video";

type MediaRecord = {
  id: number;
  title: string;
  media_type: MediaType;
  src: string;
  description: string | null;
  sort_order: number;
  is_published: number;
};

type SyncStatus = "pending" | "synced" | "error";

type LeadPayloadBase = {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  company?: string;
  notes?: string;
};

type QuoteOrderLine = {
  name: string;
  qty: number;
  price: number;
};

type QuotePayload = LeadPayloadBase & {
  service: string;
  subService: string;
  quantity: number | string;
  months?: number;
  estimate: string;
  orderLines?: QuoteOrderLine[];
};

type ContactPayload = {
  nombre: string;
  correo: string;
  empresa?: string;
  mensaje: string;
};

const LEAD_TYPE_QUOTE = "cotización";
const LEAD_TYPE_RECRUITMENT = "recruitment";

type JobPosition = {
  id: number;
  name: string;
};

type DocumentFile = {
  name: string;
  datas: string; // base64
  mimetype: string;
};

type DocumentsPayload = {
  files: DocumentFile[];
  folderName: string;
  customerName?: string;
  leadId?: number;
};

type DocumentUploadResult = {
  fileName: string;
  documentId: number | null;
  syncStatus: SyncStatus;
  syncError: string | null;
};

type RecruitmentPayload = {
  nombre: string;
  correo: string;
  telefono?: string;
  mensaje?: string;
  jobId?: number;
};

const json = (data: unknown, status = 200, origin = "*") =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": origin,
      "access-control-allow-methods": "GET,POST,PUT,DELETE,OPTIONS",
      "access-control-allow-headers": "content-type,x-admin-token",
    },
  });

const parseAllowedOrigins = (raw: string | undefined): string[] => {
  if (!raw) return ["*"];
  const items = raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return items.length ? items : ["*"];
};

const resolveCorsOrigin = (request: Request, env: Env): string => {
  const requestOrigin = request.headers.get("origin");
  const allowedOrigins = parseAllowedOrigins(env.CORS_ORIGIN);

  if (allowedOrigins.includes("*")) return "*";
  if (!requestOrigin) return allowedOrigins[0] ?? "*";
  if (allowedOrigins.includes(requestOrigin)) return requestOrigin;
  return allowedOrigins[0] ?? "*";
};

const isOriginAllowed = (request: Request, env: Env): boolean => {
  const requestOrigin = request.headers.get("origin");
  const allowedOrigins = parseAllowedOrigins(env.CORS_ORIGIN);
  if (allowedOrigins.includes("*")) return true;
  if (!requestOrigin) return true;
  return allowedOrigins.includes(requestOrigin);
};

const getIdFromPath = (url: URL): number | null => {
  const maybeId = url.pathname.split("/").at(-1);
  if (!maybeId) return null;
  const id = Number(maybeId);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
};

const isAdmin = (request: Request, env: Env): boolean => {
  const expected = env.ADMIN_TOKEN?.trim();
  if (!expected) return false;

  const rawHeader = request.headers.get("x-admin-token")?.trim();
  if (!rawHeader) return false;

  const provided = rawHeader.startsWith("Bearer ") ? rawHeader.slice(7).trim() : rawHeader;
  return provided === expected;
};

const toStringOrNull = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const toOptionalString = (value: unknown, maxLen = 500): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLen);
};

const escapeHtml = (input: string): string =>
  input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const isValidEmail = (email: string): boolean => {
  const normalized = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
};

const parseJsonBody = async (request: Request): Promise<Record<string, unknown>> => {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    return body;
  } catch {
    throw new Error("Invalid JSON body");
  }
};

const RATE_LIMIT_MAX_REQUESTS = 3;
const RATE_LIMIT_WINDOW_SECONDS = 10 * 60;

const resolveClientIp = (request: Request): string => {
  const cfIp = request.headers.get("cf-connecting-ip")?.trim();
  if (cfIp) return cfIp;

  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (forwarded) return forwarded;

  return "unknown";
};

const enforceRateLimit = async (
  request: Request,
  env: Env,
  origin: string,
  routeKey: string
): Promise<Response | null> => {
  const ipAddress = resolveClientIp(request);
  const cutoffIso = new Date(Date.now() - RATE_LIMIT_WINDOW_SECONDS * 1000).toISOString();

  try {
    const countRow = await env.DB.prepare(
      `SELECT COUNT(*) AS count
       FROM rate_limit_events
       WHERE ip_address = ? AND route_key = ? AND created_at >= ?`
    )
      .bind(ipAddress, routeKey, cutoffIso)
      .first<{ count?: number | string | null }>();

    const currentCount = Number(countRow?.count ?? 0);
    if (currentCount >= RATE_LIMIT_MAX_REQUESTS) {
      return new Response(
        JSON.stringify({
          error: "Too many requests from this IP. Try again later.",
          retryAfterSeconds: RATE_LIMIT_WINDOW_SECONDS,
        }),
        {
          status: 429,
          headers: {
            "content-type": "application/json; charset=utf-8",
            "access-control-allow-origin": origin,
            "access-control-allow-methods": "GET,POST,PUT,DELETE,OPTIONS",
            "access-control-allow-headers": "content-type,x-admin-token",
            "retry-after": String(RATE_LIMIT_WINDOW_SECONDS),
          },
        }
      );
    }

    await env.DB.prepare(
      `INSERT INTO rate_limit_events (ip_address, route_key, created_at)
       VALUES (?, ?, ?)`
    )
      .bind(ipAddress, routeKey, new Date().toISOString())
      .run();

    return null;
  } catch {
    // Fail-open to avoid blocking real leads if rate-limit storage fails.
    return null;
  }
};

const requireOdooEnv = (env: Env) => {
  const baseUrl = env.ODOO_BASE_URL?.trim();
  const db = env.ODOO_DB?.trim();
  const user = env.ODOO_USER?.trim();
  const password = env.ODOO_PASSWORD?.trim();

  if (!baseUrl || !db || !user || !password) {
    throw new Error("Odoo environment is not configured in worker secrets");
  }

  return { baseUrl, db, user, password };
};

const extractSessionCookie = (setCookieRaw: string | null): string | null => {
  if (!setCookieRaw) return null;
  const firstCookie = setCookieRaw.split(",")[0]?.trim();
  if (!firstCookie) return null;
  const cookiePair = firstCookie.split(";")[0]?.trim();
  return cookiePair || null;
};

const odooAuthenticate = async (env: Env): Promise<{ baseUrl: string; cookie: string }> => {
  const { baseUrl, db, user, password } = requireOdooEnv(env);
  const authRes = await fetch(`${baseUrl}/web/session/authenticate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "call",
      id: 1,
      params: { db, login: user, password },
    }),
  });

  if (!authRes.ok) {
    throw new Error(`Odoo auth failed (${authRes.status})`);
  }

  const authData = (await authRes.json()) as { result?: { uid?: number } };
  if (!authData.result?.uid) {
    throw new Error("Odoo auth rejected credentials");
  }

  const cookie = extractSessionCookie(authRes.headers.get("set-cookie"));
  if (!cookie) {
    throw new Error("Odoo auth did not return session cookie");
  }

  return { baseUrl, cookie };
};

const odooCallKw = async <T>(
  baseUrl: string,
  cookie: string,
  model: string,
  method: string,
  args: unknown[],
  kwargs: Record<string, unknown> = {}
): Promise<T> => {
  const response = await fetch(`${baseUrl}/web/dataset/call_kw`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "call",
      id: 2,
      params: { model, method, args, kwargs },
    }),
  });

  if (!response.ok) {
    throw new Error(`Odoo call failed (${response.status})`);
  }

  const data = (await response.json()) as {
    result?: T;
    error?: { message?: string; data?: { message?: string } };
  };

  if (data.error) {
    throw new Error(data.error.data?.message || data.error.message || "Odoo call error");
  }

  return data.result as T;
};

const ensurePartner = async (
  baseUrl: string,
  cookie: string,
  name: string,
  email: string,
  phone: string | null,
  company: string | null
): Promise<number> => {
  const existing = await odooCallKw<number[]>(
    baseUrl,
    cookie,
    "res.partner",
    "search",
    [[["email", "=", email]]]
  );

  if (existing.length > 0) return existing[0];

  return odooCallKw<number>(
    baseUrl,
    cookie,
    "res.partner",
    "create",
    [
      {
        name,
        email,
        phone: phone || undefined,
        company_name: company || undefined,
        customer_rank: 1,
      },
    ]
  );
};

const syncContactToOdoo = async (env: Env, payload: ContactPayload) => {
  const normalizedName = payload.nombre.trim();
  const normalizedEmail = payload.correo.trim().toLowerCase();
  const normalizedCompany = toOptionalString(payload.empresa, 200);
  const { baseUrl, cookie } = await odooAuthenticate(env);

  const partnerId = await ensurePartner(
    baseUrl,
    cookie,
    normalizedName,
    normalizedEmail,
    null,
    normalizedCompany
  );

  return { partnerId };
};

const normalizeOrderLines = (value: unknown): QuoteOrderLine[] => {
  if (!Array.isArray(value)) return [];
  const lines: QuoteOrderLine[] = [];

  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    const name = toOptionalString(record.name, 200);
    const qty = typeof record.qty === "number" ? record.qty : Number(record.qty);
    const price = typeof record.price === "number" ? record.price : Number(record.price);
    if (!name || !Number.isFinite(qty) || !Number.isFinite(price) || qty <= 0 || price < 0) continue;
    lines.push({ name, qty, price });
  }

  return lines;
};

const syncQuoteToOdoo = async (env: Env, payload: QuotePayload) => {
  const customerName = toOptionalString(payload.customerName, 150);
  const customerEmail = toOptionalString(payload.customerEmail, 150)?.toLowerCase() ?? null;
  const customerPhone = toOptionalString(payload.customerPhone, 60);
  const company = toOptionalString(payload.company, 200);
  const service = toOptionalString(payload.service, 120) ?? "Servicio";
  const subService = toOptionalString(payload.subService, 120) ?? "General";
  const estimate = toOptionalString(payload.estimate, 80) ?? "N/A";
  const notes = toOptionalString(payload.notes, 3000);
  const quantity =
    typeof payload.quantity === "string" || typeof payload.quantity === "number"
      ? String(payload.quantity)
      : "N/A";
  const months = typeof payload.months === "number" ? payload.months : null;

  if (!customerName || !customerEmail || !isValidEmail(customerEmail)) {
    throw new Error("Quote payload missing valid customer fields");
  }

  const orderLines = normalizeOrderLines(payload.orderLines);
  const { baseUrl, cookie } = await odooAuthenticate(env);
  const partnerId = await ensurePartner(baseUrl, cookie, customerName, customerEmail, customerPhone, company);

  const noteParts = [
    "<p><strong>Solicitud de cotización web</strong></p>",
    `<p><strong>Nombre:</strong> ${escapeHtml(customerName)}</p>`,
    `<p><strong>Correo:</strong> ${escapeHtml(customerEmail)}</p>`,
    customerPhone ? `<p><strong>Teléfono:</strong> ${escapeHtml(customerPhone)}</p>` : "",
    company ? `<p><strong>Empresa:</strong> ${escapeHtml(company)}</p>` : "",
    `<p><strong>Servicio:</strong> ${escapeHtml(service)}</p>`,
    `<p><strong>Sub-servicio:</strong> ${escapeHtml(subService)}</p>`,
    `<p><strong>Cantidad:</strong> ${escapeHtml(quantity)}</p>`,
    months ? `<p><strong>Duración:</strong> ${months} meses</p>` : "",
    `<p><strong>Estimación:</strong> ${escapeHtml(estimate)}</p>`,
    notes ? `<p><strong>Notas:</strong> ${escapeHtml(notes)}</p>` : "",
  ]
    .filter(Boolean)
    .join("");

  const odooOrderLines = orderLines.map((line) => [
    0,
    0,
    {
      name: line.name,
      product_uom_qty: line.qty,
      price_unit: line.price,
      product_id: false,
    },
  ]);

  const saleOrderId = await odooCallKw<number>(
    baseUrl,
    cookie,
    "sale.order",
    "create",
    [
      {
        partner_id: partnerId,
        client_order_ref: `Web - ${service}`,
        note: noteParts,
        order_line: odooOrderLines,
      },
    ]
  );

  return { partnerId, saleOrderId };
};

const getRecruitmentStageId = async (baseUrl: string, cookie: string): Promise<number | null> => {
  try {
    const stages = await odooCallKw<{ id: number; name: string }[]>(
      baseUrl,
      cookie,
      "hr.recruitment.stage",
      "search_read",
      [[["fold", "=", false]]],
      { fields: ["id", "name"], limit: 1, order: "sequence asc" }
    );
    return stages.length > 0 ? stages[0].id : null;
  } catch {
    return null;
  }
};

const getJobPositionsFromOdoo = async (env: Env): Promise<JobPosition[]> => {
  const { baseUrl, cookie } = await odooAuthenticate(env);
  return odooCallKw<JobPosition[]>(
    baseUrl,
    cookie,
    "hr.job",
    "search_read",
    [[]],
    { fields: ["id", "name"], order: "name asc" }
  );
};

const syncRecruitmentToOdoo = async (env: Env, payload: RecruitmentPayload) => {
  const nombre = toOptionalString(payload.nombre, 150);
  const correo = toOptionalString(payload.correo, 150)?.toLowerCase() ?? null;
  const telefono = toOptionalString(payload.telefono, 60);
  const mensaje = toOptionalString(payload.mensaje, 3000);
  const jobId =
    typeof payload.jobId === "number" && Number.isInteger(payload.jobId) && payload.jobId > 0
      ? payload.jobId
      : null;

  if (!nombre || !correo || !isValidEmail(correo)) {
    throw new Error("Recruitment payload missing valid nombre/correo");
  }

  const { baseUrl, cookie } = await odooAuthenticate(env);
  const stageId = await getRecruitmentStageId(baseUrl, cookie);

  const candidateVals: Record<string, unknown> = {
    partner_name: nombre,
    email_from: correo,
  };
  if (telefono) candidateVals.partner_phone = telefono;

  const candidateId = await odooCallKw<number>(baseUrl, cookie, "hr.candidate", "create", [candidateVals]);
  if (!candidateId || typeof candidateId !== "number") {
    throw new Error(`Could not create candidate in Odoo (ID: ${candidateId})`);
  }

  const appVals: Record<string, unknown> = {
    candidate_id: candidateId,
    partner_name: nombre,
    email_from: correo,
    partner_phone: telefono || false,
  };
  if (jobId) appVals.job_id = jobId;
  if (stageId) appVals.stage_id = stageId;
  if (mensaje) appVals.applicant_notes = `<p>${escapeHtml(mensaje)}</p>`;

  const applicantId = await odooCallKw<number>(baseUrl, cookie, "hr.applicant", "create", [appVals]);
  if (!applicantId || typeof applicantId !== "number") {
    throw new Error(`Could not create applicant in Odoo (ID: ${applicantId})`);
  }

  return { candidateId, applicantId };
};

const findDocumentFolder = async (
  baseUrl: string,
  cookie: string,
  nameOrToken: string
): Promise<number | null> => {
  try {
    // Buscar la carpeta de Documents por nombre.
    const byName = await odooCallKw<{ id: number }[]>(
      baseUrl, cookie, "documents.folder", "search_read",
      [[["name", "=", nameOrToken]]],
      { fields: ["id"], limit: 1 }
    );
    if (byName.length > 0) return byName[0].id;

    // Nombre parcial como último recurso.
    const byPartial = await odooCallKw<{ id: number }[]>(
      baseUrl, cookie, "documents.folder", "search_read",
      [[["name", "ilike", nameOrToken]]],
      { fields: ["id"], limit: 1 }
    );
    return byPartial.length > 0 ? byPartial[0].id : null;
  } catch {
    return null;
  }
};

const uploadDocumentsToOdoo = async (
  env: Env,
  payload: DocumentsPayload
): Promise<DocumentUploadResult[]> => {
  const { baseUrl, cookie } = await odooAuthenticate(env);
  const folderId = await findDocumentFolder(baseUrl, cookie, payload.folderName);

  const results: DocumentUploadResult[] = [];
  for (const file of payload.files) {
    try {
      const vals: Record<string, unknown> = {
        name: file.name,
        datas: file.datas,
        mimetype: file.mimetype || "application/octet-stream",
        type: "binary",
      };
      if (folderId) vals.folder_id = folderId;
      if (payload.customerName) vals.description = `Cotización de: ${payload.customerName}`;

      const docId = await odooCallKw<number>(
        baseUrl, cookie, "documents.document", "create", [vals]
      );
      results.push({
        fileName: file.name,
        documentId: docId,
        syncStatus: "synced",
        syncError: null,
      });
    } catch (error) {
      results.push({
        fileName: file.name,
        documentId: null,
        syncStatus: "error",
        syncError: error instanceof Error ? error.message.slice(0, 1000) : "Failed to upload document to Odoo",
      });
    }
  }
  return results;
};

const getBase64Size = (input: string): number => {
  const normalized = input.replace(/\s+/g, "");
  const padding = normalized.endsWith("==") ? 2 : normalized.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor((normalized.length * 3) / 4) - padding);
};

const storeDocumentsInD1 = async (
  env: Env,
  payload: DocumentsPayload,
  uploadResults: DocumentUploadResult[]
): Promise<number[]> => {
  if (!payload.leadId) {
    throw new Error("leadId is required to persist documents");
  }

  const storedIds: number[] = [];
  for (const [index, file] of payload.files.entries()) {
    const result = uploadResults[index] ?? {
      fileName: file.name,
      documentId: null,
      syncStatus: "error" as SyncStatus,
      syncError: "Missing upload result",
    };

    const insert = await env.DB.prepare(
      `INSERT INTO quote_attachments (
        lead_id, file_name, mime_type, file_size_bytes, file_base64, folder_name,
        customer_name, odoo_document_id, sync_status, sync_error, created_at, updated_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        payload.leadId,
        file.name,
        file.mimetype || "application/octet-stream",
        getBase64Size(file.datas),
        file.datas,
        payload.folderName,
        payload.customerName ?? null,
        result.documentId,
        result.syncStatus,
        result.syncError,
        nowIso(),
        nowIso()
      )
      .run();

    storedIds.push(Number(insert.meta.last_row_id));
  }

  return storedIds;
};

const nowIso = () => new Date().toISOString();

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = resolveCorsOrigin(request, env);
    if (!isOriginAllowed(request, env)) {
      return json({ error: "Origin not allowed" }, 403, origin);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "access-control-allow-origin": origin,
          "access-control-allow-methods": "GET,POST,PUT,DELETE,OPTIONS",
          "access-control-allow-headers": "content-type,x-admin-token",
        },
      });
    }

    if (request.method === "POST" && url.pathname === "/api/leads/contact") {
      const rateLimitResponse = await enforceRateLimit(request, env, origin, "contact");
      if (rateLimitResponse) return rateLimitResponse;

      let body: Record<string, unknown>;
      try {
        body = await parseJsonBody(request);
      } catch {
        return json({ error: "Invalid JSON body" }, 400, origin);
      }

      const nombre = toOptionalString(body.nombre, 150);
      const correo = toOptionalString(body.correo, 150)?.toLowerCase() ?? null;
      const empresa = toOptionalString(body.empresa, 200);
      const mensaje = toOptionalString(body.mensaje, 3000);

      if (!nombre || !correo || !mensaje || !isValidEmail(correo)) {
        return json({ error: "nombre, correo (valid email) y mensaje son obligatorios" }, 400, origin);
      }

      const insert = await env.DB.prepare(
        `INSERT INTO leads (
          lead_type, name, email, phone, company, message, sync_status, ip_address, user_agent, created_at, updated_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          "contact",
          nombre,
          correo,
          null,
          empresa,
          mensaje,
          "pending",
          request.headers.get("cf-connecting-ip"),
          request.headers.get("user-agent"),
          nowIso(),
          nowIso()
        )
        .run();

      const leadId = Number(insert.meta.last_row_id);
      let syncStatus: SyncStatus = "pending";
      let syncError: string | null = null;
      let odooPartnerId: number | null = null;
      let odooSaleOrderId: number | null = null;

      try {
        const sync = await syncContactToOdoo(env, {
          nombre,
          correo,
          empresa: empresa ?? undefined,
          mensaje,
        });
        syncStatus = "synced";
        odooPartnerId = sync.partnerId;
      } catch (error) {
        syncStatus = "error";
        syncError = error instanceof Error ? error.message.slice(0, 1000) : "Unknown sync error";
      }

      await env.DB.prepare(
        `UPDATE leads
         SET sync_status = ?, sync_error = ?, odoo_partner_id = ?, odoo_sale_order_id = ?, updated_at = ?
         WHERE id = ?`
      )
        .bind(syncStatus, syncError, odooPartnerId, odooSaleOrderId, nowIso(), leadId)
        .run();

      return json(
        {
          ok: true,
          leadId,
          syncStatus,
          odooSaleOrderId,
          message:
            syncStatus === "synced"
              ? "Lead recibido y sincronizado con Odoo"
              : "Lead recibido. Pendiente de sincronización con Odoo",
        },
        syncStatus === "synced" ? 201 : 202,
        origin
      );
    }

    if (request.method === "POST" && url.pathname === "/api/leads/quote") {
      const rateLimitResponse = await enforceRateLimit(request, env, origin, "quote");
      if (rateLimitResponse) return rateLimitResponse;

      let body: Record<string, unknown>;
      try {
        body = await parseJsonBody(request);
      } catch {
        return json({ error: "Invalid JSON body" }, 400, origin);
      }

      const payload: QuotePayload = {
        customerName: toOptionalString(body.customerName, 150) ?? undefined,
        customerEmail: toOptionalString(body.customerEmail, 150) ?? undefined,
        customerPhone: toOptionalString(body.customerPhone, 60) ?? undefined,
        company: toOptionalString(body.company, 200) ?? undefined,
        notes: toOptionalString(body.notes, 3000) ?? undefined,
        service: toOptionalString(body.service, 120) ?? "",
        subService: toOptionalString(body.subService, 120) ?? "",
        quantity:
          typeof body.quantity === "string" || typeof body.quantity === "number"
            ? body.quantity
            : "",
        months: typeof body.months === "number" ? body.months : undefined,
        estimate: toOptionalString(body.estimate, 80) ?? "",
        orderLines: normalizeOrderLines(body.orderLines),
      };

      if (
        !payload.customerName ||
        !payload.customerEmail ||
        !isValidEmail(payload.customerEmail) ||
        !payload.service ||
        !payload.subService ||
        payload.quantity === "" ||
        !payload.estimate
      ) {
        return json(
          {
            error:
              "customerName, customerEmail (valid email), service, subService, quantity y estimate son obligatorios",
          },
          400,
          origin
        );
      }

      const insert = await env.DB.prepare(
        `INSERT INTO leads (
          lead_type, name, email, phone, company, message, service, sub_service, quantity_text, months, estimate,
          order_lines_json, sync_status, ip_address, user_agent, created_at, updated_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          LEAD_TYPE_QUOTE,
          payload.customerName,
          payload.customerEmail.toLowerCase(),
          payload.customerPhone ?? null,
          payload.company ?? null,
          payload.notes ?? null,
          payload.service,
          payload.subService,
          String(payload.quantity),
          payload.months ?? null,
          payload.estimate,
          JSON.stringify(payload.orderLines ?? []),
          "pending",
          request.headers.get("cf-connecting-ip"),
          request.headers.get("user-agent"),
          nowIso(),
          nowIso()
        )
        .run();

      const leadId = Number(insert.meta.last_row_id);
      let syncStatus: SyncStatus = "pending";
      let syncError: string | null = null;
      let odooPartnerId: number | null = null;
      let odooSaleOrderId: number | null = null;

      try {
        const sync = await syncQuoteToOdoo(env, payload);
        syncStatus = "synced";
        odooPartnerId = sync.partnerId;
        odooSaleOrderId = sync.saleOrderId;
      } catch (error) {
        syncStatus = "error";
        syncError = error instanceof Error ? error.message.slice(0, 1000) : "Unknown sync error";
      }

      await env.DB.prepare(
        `UPDATE leads
         SET sync_status = ?, sync_error = ?, odoo_partner_id = ?, odoo_sale_order_id = ?, updated_at = ?
         WHERE id = ?`
      )
        .bind(syncStatus, syncError, odooPartnerId, odooSaleOrderId, nowIso(), leadId)
        .run();

      return json(
        {
          ok: true,
          leadId,
          syncStatus,
          odooSaleOrderId,
          message:
            syncStatus === "synced"
              ? "Cotización recibida y sincronizada con Odoo"
              : "Cotización recibida. Pendiente de sincronización con Odoo",
        },
        syncStatus === "synced" ? 201 : 202,
        origin
      );
    }

    if (request.method === "GET" && url.pathname === "/api/leads/recruitment/jobs") {
      try {
        const jobs = await getJobPositionsFromOdoo(env);
        return json({ items: jobs }, 200, origin);
      } catch (error) {
        return json(
          { error: error instanceof Error ? error.message : "Could not fetch Odoo jobs" },
          500,
          origin
        );
      }
    }

    if (request.method === "POST" && url.pathname === "/api/leads/recruitment") {
      const rateLimitResponse = await enforceRateLimit(request, env, origin, "recruitment");
      if (rateLimitResponse) return rateLimitResponse;

      let body: Record<string, unknown>;
      try {
        body = await parseJsonBody(request);
      } catch {
        return json({ error: "Invalid JSON body" }, 400, origin);
      }

      const nombre = toOptionalString(body.nombre, 150);
      const correo = toOptionalString(body.correo, 150)?.toLowerCase() ?? null;
      const telefono = toOptionalString(body.telefono, 60);
      const mensaje = toOptionalString(body.mensaje, 3000);
      const jobId =
        typeof body.jobId === "number" && Number.isInteger(body.jobId) && body.jobId > 0
          ? body.jobId
          : null;

      if (!nombre || !correo || !isValidEmail(correo)) {
        return json({ error: "nombre y correo (email válido) son obligatorios" }, 400, origin);
      }

      const insert = await env.DB.prepare(
        `INSERT INTO leads (
          lead_type, name, email, phone, company, message, service, sync_status, ip_address, user_agent, created_at, updated_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          LEAD_TYPE_RECRUITMENT,
          nombre,
          correo,
          telefono,
          null,
          mensaje,
          jobId ? String(jobId) : null,
          "pending",
          request.headers.get("cf-connecting-ip"),
          request.headers.get("user-agent"),
          nowIso(),
          nowIso()
        )
        .run();

      const leadId = Number(insert.meta.last_row_id);
      let syncStatus: SyncStatus = "pending";
      let syncError: string | null = null;
      let odooPartnerId: number | null = null;
      let odooSaleOrderId: number | null = null;

      try {
        const sync = await syncRecruitmentToOdoo(env, {
          nombre,
          correo,
          telefono: telefono ?? undefined,
          mensaje: mensaje ?? undefined,
          jobId: jobId ?? undefined,
        });
        syncStatus = "synced";
        odooPartnerId = sync.candidateId;
        odooSaleOrderId = sync.applicantId;
      } catch (error) {
        syncStatus = "error";
        syncError = error instanceof Error ? error.message.slice(0, 1000) : "Unknown sync error";
      }

      await env.DB.prepare(
        `UPDATE leads
         SET sync_status = ?, sync_error = ?, odoo_partner_id = ?, odoo_sale_order_id = ?, updated_at = ?
         WHERE id = ?`
      )
        .bind(syncStatus, syncError, odooPartnerId, odooSaleOrderId, nowIso(), leadId)
        .run();

      return json(
        {
          ok: true,
          leadId,
          syncStatus,
          odooApplicantId: odooSaleOrderId,
          message:
            syncStatus === "synced"
              ? "Postulación recibida y sincronizada con Odoo"
              : "Postulación recibida. Pendiente de sincronización con Odoo",
        },
        syncStatus === "synced" ? 201 : 202,
        origin
      );
    }

    if (request.method === "GET" && url.pathname === "/api/leads") {
      if (!isAdmin(request, env)) {
        return json({ error: "Unauthorized" }, 401, origin);
      }

      const limit = Math.min(Number(url.searchParams.get("limit") || 50), 200);
      const status = toOptionalString(url.searchParams.get("status"), 20);

      const query =
        status && (status === "pending" || status === "synced" || status === "error")
          ? env.DB.prepare(
              `SELECT id, lead_type, name, email, company, service, sub_service, sync_status, sync_error, odoo_sale_order_id, created_at
               FROM leads
               WHERE sync_status = ?
               ORDER BY id DESC
               LIMIT ?`
            ).bind(status, limit)
          : env.DB.prepare(
              `SELECT id, lead_type, name, email, company, service, sub_service, sync_status, sync_error, odoo_sale_order_id, created_at
               FROM leads
               ORDER BY id DESC
               LIMIT ?`
            ).bind(limit);

      const rows = await query.all<Record<string, unknown>>();
      return json({ items: rows.results ?? [] }, 200, origin);
    }

    if (request.method === "POST" && /^\/api\/leads\/\d+\/retry$/.test(url.pathname)) {
      if (!isAdmin(request, env)) {
        return json({ error: "Unauthorized" }, 401, origin);
      }

      const id = Number(url.pathname.split("/")[3]);
      if (!Number.isInteger(id) || id <= 0) {
        return json({ error: "Invalid id" }, 400, origin);
      }

      const lead = await env.DB.prepare(
        `SELECT id, lead_type, name, email, phone, company, message, service, sub_service, quantity_text, months, estimate, order_lines_json
         FROM leads
         WHERE id = ?`
      )
        .bind(id)
        .first<Record<string, unknown>>();

      if (!lead) {
        return json({ error: "Lead not found" }, 404, origin);
      }

      let syncStatus: SyncStatus = "synced";
      let syncError: string | null = null;
      let odooPartnerId: number | null = null;
      let odooSaleOrderId: number | null = null;

      try {
        if (lead.lead_type === "contact") {
          const sync = await syncContactToOdoo(env, {
            nombre: String(lead.name ?? ""),
            correo: String(lead.email ?? ""),
            empresa: lead.company ? String(lead.company) : undefined,
            mensaje: String(lead.message ?? ""),
          });
          odooPartnerId = sync.partnerId;
        } else if (lead.lead_type === LEAD_TYPE_RECRUITMENT) {
          const jobId = lead.service ? Number(lead.service) : null;
          const sync = await syncRecruitmentToOdoo(env, {
            nombre: String(lead.name ?? ""),
            correo: String(lead.email ?? ""),
            telefono: lead.phone ? String(lead.phone) : undefined,
            mensaje: lead.message ? String(lead.message) : undefined,
            jobId: jobId && Number.isInteger(jobId) && jobId > 0 ? jobId : undefined,
          });
          odooPartnerId = sync.candidateId;
          odooSaleOrderId = sync.applicantId;
        } else {
          const parsedOrderLines = (() => {
            try {
              return normalizeOrderLines(
                lead.order_lines_json ? JSON.parse(String(lead.order_lines_json)) : []
              );
            } catch {
              return [];
            }
          })();

          const sync = await syncQuoteToOdoo(env, {
            customerName: String(lead.name ?? ""),
            customerEmail: String(lead.email ?? ""),
            customerPhone: lead.phone ? String(lead.phone) : undefined,
            company: lead.company ? String(lead.company) : undefined,
            notes: lead.message ? String(lead.message) : undefined,
            service: String(lead.service ?? ""),
            subService: String(lead.sub_service ?? ""),
            quantity: String(lead.quantity_text ?? ""),
            months: typeof lead.months === "number" ? lead.months : undefined,
            estimate: String(lead.estimate ?? ""),
            orderLines: parsedOrderLines,
          });
          odooPartnerId = sync.partnerId;
          odooSaleOrderId = sync.saleOrderId;
        }
      } catch (error) {
        syncStatus = "error";
        syncError = error instanceof Error ? error.message.slice(0, 1000) : "Unknown retry error";
      }

      await env.DB.prepare(
        `UPDATE leads
         SET sync_status = ?, sync_error = ?, odoo_partner_id = ?, odoo_sale_order_id = ?, updated_at = ?
         WHERE id = ?`
      )
        .bind(syncStatus, syncError, odooPartnerId, odooSaleOrderId, nowIso(), id)
        .run();

      return json(
        { ok: true, leadId: id, syncStatus, odooSaleOrderId, syncError },
        syncStatus === "synced" ? 200 : 500,
        origin
      );
    }

    if (request.method === "POST" && url.pathname === "/api/leads/documents") {
      const rateLimitResponse = await enforceRateLimit(request, env, origin, "documents");
      if (rateLimitResponse) return rateLimitResponse;

      let body: Record<string, unknown>;
      try {
        body = await parseJsonBody(request);
      } catch {
        return json({ error: "Invalid JSON body" }, 400, origin);
      }

      const folderName = toOptionalString(body.folderName, 200) ?? "pagina cotizaciones";
      const customerName = toOptionalString(body.customerName, 150);
      const leadId =
        typeof body.leadId === "number" && Number.isInteger(body.leadId) && body.leadId > 0
          ? body.leadId
          : null;
      const rawFiles = Array.isArray(body.files) ? body.files : [];

      if (!leadId) {
        return json({ error: "leadId is required" }, 400, origin);
      }

      const lead = await env.DB.prepare(`SELECT id FROM leads WHERE id = ?`).bind(leadId).first<{ id: number }>();
      if (!lead) {
        return json({ error: "Lead not found" }, 404, origin);
      }

      // base64 de 2 MB = ~2.73 MB de texto (~2,864,000 chars)
      const MAX_BASE64_LEN = Math.ceil((2 * 1024 * 1024 * 4) / 3) + 100;
      const MAX_FILES = 10;

      const files: DocumentFile[] = [];
      for (const f of rawFiles.slice(0, MAX_FILES)) {
        if (!f || typeof f !== "object") continue;
        const r = f as Record<string, unknown>;
        const name = toOptionalString(r.name, 200);
        const datas =
          typeof r.datas === "string" && r.datas.length <= MAX_BASE64_LEN
            ? r.datas
            : null;
        const mimetype =
          toOptionalString(r.mimetype, 100) || "application/octet-stream";
        if (!name || !datas) continue;
        files.push({ name, datas, mimetype });
      }

      if (files.length === 0) {
        return json({ error: "No valid files provided" }, 400, origin);
      }

      try {
        const uploadResults = await uploadDocumentsToOdoo(env, {
          files,
          folderName,
          customerName: customerName || undefined,
          leadId,
        });

        const storedIds = await storeDocumentsInD1(env, {
          files,
          folderName,
          customerName: customerName || undefined,
          leadId,
        }, uploadResults);

        const documentIds = uploadResults
          .map((result) => result.documentId)
          .filter((id): id is number => typeof id === "number" && id > 0);
        const failedUploads = uploadResults.filter((result) => result.syncStatus === "error");

        if (failedUploads.length > 0) {
          return json(
            {
              ok: false,
              storedIds,
              documentIds,
              failedFiles: failedUploads.map((result) => ({ fileName: result.fileName, error: result.syncError })),
              error: "Some documents could not be uploaded to Odoo",
            },
            502,
            origin
          );
        }

        return json({ ok: true, storedIds, documentIds }, 201, origin);
      } catch (error) {
        return json(
          { error: error instanceof Error ? error.message : "Failed to persist documents" },
          500,
          origin
        );
      }
    }

    if (!url.pathname.startsWith("/api/media")) {
      return json({ error: "Not found" }, 404, origin);
    }

    if (request.method === "GET" && url.pathname === "/api/media") {
      const result = await env.DB.prepare(
        `SELECT id, title, media_type, src, description, sort_order, is_published
         FROM media_items
         WHERE is_published = 1
         ORDER BY sort_order ASC, id DESC`
      ).all<MediaRecord>();

      return json(
        {
          items: (result.results ?? []).map((item) => ({
            id: item.id,
            title: item.title,
            media_type: item.media_type,
            src: item.src,
            description: item.description,
          })),
        },
        200,
        origin
      );
    }

    if (request.method === "POST" && url.pathname === "/api/media") {
      if (!isAdmin(request, env)) {
        return json({ error: "Unauthorized" }, 401, origin);
      }

      const body = (await request.json()) as Record<string, unknown>;
      const title = toStringOrNull(body.title);
      const src = toStringOrNull(body.src);
      const mediaType = body.media_type;
      const description = toStringOrNull(body.description);
      const sortOrder = typeof body.sort_order === "number" ? body.sort_order : 0;
      const isPublished = body.is_published === 0 ? 0 : 1;

      if (!title || !src || (mediaType !== "image" && mediaType !== "video")) {
        return json({ error: "title, src and media_type are required" }, 400, origin);
      }

      const insert = await env.DB.prepare(
        `INSERT INTO media_items (title, media_type, src, description, sort_order, is_published)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
        .bind(title, mediaType, src, description, sortOrder, isPublished)
        .run();

      return json({ ok: true, id: insert.meta.last_row_id }, 201, origin);
    }

    if (request.method === "PUT" && /^\/api\/media\/\d+$/.test(url.pathname)) {
      if (!isAdmin(request, env)) {
        return json({ error: "Unauthorized" }, 401, origin);
      }

      const id = getIdFromPath(url);
      if (!id) return json({ error: "Invalid id" }, 400, origin);

      const body = (await request.json()) as Record<string, unknown>;
      const title = toStringOrNull(body.title);
      const src = toStringOrNull(body.src);
      const mediaType = body.media_type;
      const description = toStringOrNull(body.description);
      const sortOrder = typeof body.sort_order === "number" ? body.sort_order : null;
      const isPublished =
        typeof body.is_published === "number" && (body.is_published === 0 || body.is_published === 1)
          ? body.is_published
          : null;

      if (mediaType && mediaType !== "image" && mediaType !== "video") {
        return json({ error: "media_type must be image or video" }, 400, origin);
      }

      const update = await env.DB.prepare(
        `UPDATE media_items
         SET
           title = COALESCE(?, title),
           media_type = COALESCE(?, media_type),
           src = COALESCE(?, src),
           description = COALESCE(?, description),
           sort_order = COALESCE(?, sort_order),
           is_published = COALESCE(?, is_published),
           updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`
      )
        .bind(title, mediaType ?? null, src, description, sortOrder, isPublished, id)
        .run();

      return json({ ok: true, changed: update.meta.changes }, 200, origin);
    }

    if (request.method === "DELETE" && /^\/api\/media\/\d+$/.test(url.pathname)) {
      if (!isAdmin(request, env)) {
        return json({ error: "Unauthorized" }, 401, origin);
      }

      const id = getIdFromPath(url);
      if (!id) return json({ error: "Invalid id" }, 400, origin);

      const deleted = await env.DB.prepare("DELETE FROM media_items WHERE id = ?").bind(id).run();
      return json({ ok: true, changed: deleted.meta.changes }, 200, origin);
    }

    return json({ error: "Method not allowed" }, 405, origin);
  },
};

export interface Env {
  DB: D1Database;
  ADMIN_TOKEN?: string;
  CORS_ORIGIN?: string;
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

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = env.CORS_ORIGIN || "*";

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

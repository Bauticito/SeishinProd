# Cloudflare Worker + D1 (media + leads + sync con Odoo)

Este Worker expone:
- API pública de galería: `/api/media`
- API de leads/cotizaciones: `/api/leads/contact`, `/api/leads/quote` y `/api/leads/documents`
- Persistencia en D1 para trazabilidad y recuperación ante fallos de Odoo, incluyendo adjuntos de cotización

## 1) Crear base D1

```powershell
npx wrangler d1 create seishin_media
```

Copia el `database_id` generado y colócalo en:

`cloudflare/worker/wrangler.toml`

## 2) Aplicar migraciones

```powershell
npm run cf:d1:migrate:local
npm run cf:d1:migrate:remote
```

## 3) Configurar secretos del Worker

```powershell
npx wrangler secret put ADMIN_TOKEN --config cloudflare/worker/wrangler.toml
npx wrangler secret put ODOO_BASE_URL --config cloudflare/worker/wrangler.toml
npx wrangler secret put ODOO_DB --config cloudflare/worker/wrangler.toml
npx wrangler secret put ODOO_USER --config cloudflare/worker/wrangler.toml
npx wrangler secret put ODOO_PASSWORD --config cloudflare/worker/wrangler.toml
```

## 4) Desarrollo local del Worker

```powershell
Copy-Item cloudflare/worker/.dev.vars.example cloudflare/worker/.dev.vars
npm run cf:dev
```

URL local:

`http://127.0.0.1:8787`

## 5) Configurar frontend

Crear `.env.local`:

```env
VITE_MEDIA_API_URL=http://127.0.0.1:8787/api/media
VITE_LEADS_API_URL=http://127.0.0.1:8787
```

Luego:

```powershell
npm run dev
```

## 6) Seed de galería (opcional)

```powershell
$env:MEDIA_BASE_URL="https://cdn.tudominio.com/seishin"
npm run cf:d1:seed:generate
npx wrangler d1 execute seishin_media --remote --file cloudflare/worker/seed_media.sql --config cloudflare/worker/wrangler.toml
```

## 7) Deploy

```powershell
npm run cf:deploy
```

Configura en frontend:

`VITE_MEDIA_API_URL=https://<tu-worker>.workers.dev/api/media`

`VITE_LEADS_API_URL=https://<tu-worker>.workers.dev`

## Contrato API

### Público
- `GET /api/media`
- `POST /api/leads/contact`
- `POST /api/leads/quote`
- `POST /api/leads/documents`

### Admin (header `x-admin-token`)
- `POST /api/media`
- `PUT /api/media/:id`
- `DELETE /api/media/:id`
- `GET /api/leads?limit=50&status=pending|synced|error`
- `POST /api/leads/:id/retry`

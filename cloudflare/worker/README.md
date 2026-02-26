# Cloudflare setup (functional)

This project uses:
- Cloudflare Worker as API (`/api/media`)
- Cloudflare D1 as media metadata database
- React frontend consuming `VITE_MEDIA_API_URL`

## 1) Create D1 database

```powershell
npx wrangler d1 create seishin_media
```

Copy the generated `database_id` and replace it in:

`cloudflare/worker/wrangler.toml`

## 2) Apply migrations

```powershell
npm run cf:d1:migrate:local
npm run cf:d1:migrate:remote
```

## 3) Set admin token

```powershell
npx wrangler secret put ADMIN_TOKEN --config cloudflare/worker/wrangler.toml
```

## 4) Run API locally

Create local vars file first:

```powershell
Copy-Item cloudflare/worker/.dev.vars.example cloudflare/worker/.dev.vars
```

```powershell
npm run cf:dev
```

API URL:

`http://127.0.0.1:8787/api/media`

## 5) Connect frontend

Create `.env.local` with:

```env
VITE_MEDIA_API_URL=http://127.0.0.1:8787/api/media
```

Run frontend:

```powershell
npm run dev
```

## 6) Seed D1 from local `img/`

Generate SQL from your current files:

```powershell
$env:MEDIA_BASE_URL="https://cdn.tudominio.com/seishin"
npm run cf:d1:seed:generate
```

Apply seed:

```powershell
npx wrangler d1 execute seishin_media --remote --file cloudflare/worker/seed_media.sql --config cloudflare/worker/wrangler.toml
```

## 7) Deploy Worker

```powershell
npm run cf:deploy
```

Set `VITE_MEDIA_API_URL` in your frontend env to your deployed Worker URL, e.g.:

`https://seishin-media-api.<tu-subdominio>.workers.dev/api/media`

## API contract

### Public
- `GET /api/media` -> `{ items: [{ id, title, media_type, src, description }] }`

### Admin (requires header `x-admin-token`)
- `POST /api/media`
- `PUT /api/media/:id`
- `DELETE /api/media/:id`

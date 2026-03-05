# Seishin Web

## Requisitos

- Node.js 18+
- npm 9+

## Setup local (frontend)

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Variables frontend usadas:
- `VITE_MEDIA_API_URL`
- `VITE_LEADS_API_URL`

## Validaciones antes de subir a Git

```powershell
npm run typecheck
npm run lint
npm run build
```

## Cloudflare (Worker + D1)

Guia completa:

`cloudflare/worker/README.md`

Flujo rapido:

```powershell
npm run cf:d1:migrate:local
npm run cf:dev
```

## Cloudflare Pages (frontend estatico)

Guia rapida:

`CLOUDFLARE_SETUP.md`

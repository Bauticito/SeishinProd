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

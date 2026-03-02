# Cloudflare (Plan Gratis) para `paginatest`

## 1) Deploy en Cloudflare Pages
- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version: `20` (recomendado)

## 2) Variables de entorno (si usas Supabase en cliente)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Agregalas en `Pages > Settings > Environment variables`.

## 3) SPA routing
Este proyecto usa React Router, por eso se agrego:
- `public/_redirects` con `/* /index.html 200`

Asi evitas errores `404` al refrescar rutas como `/about` o `/gallery`.

## 4) Security + cache headers
Se agrego `public/_headers` con:
- Headers de seguridad (`CSP`, `X-Frame-Options`, `nosniff`, etc.)
- Cache corta para `index.html`
- Cache larga para assets versionados (`/assets/*`)

## 5) Ajustes recomendados en Cloudflare Dashboard (gratis)
En `SSL/TLS`:
- Encryption mode: `Full` (si tu origen soporta TLS) o `Full (strict)` ideal.
- Always Use HTTPS: `ON`
- Automatic HTTPS Rewrites: `ON`

En `Speed`:
- Brotli: `ON`
- Auto Minify (HTML/CSS/JS): `ON`
- Early Hints: `ON` (si aparece disponible)

En `Caching`:
- Caching Level: `Standard`
- Browser Cache TTL: `Respect Existing Headers`

En `Security`:
- Security Level: `Medium`
- Bot Fight Mode: `ON`

## 6) Anti-bots para formularios (opcional)
Para el formulario de contacto, conviene Cloudflare Turnstile:
- Crea un sitio Turnstile
- Inserta el widget en el form
- Verifica el token en backend/worker antes de aceptar envio real

Si quieres, te lo implemento en este proyecto en el siguiente paso.

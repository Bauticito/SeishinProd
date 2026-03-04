#!/bin/bash

echo "=== Buscando configuración de nginx ==="

# Buscar el archivo de config que contiene la ruta del sitio
CONFIG=$(grep -rl "paginatest\|var/www" /etc/nginx/conf.d/ /etc/nginx/sites-available/ 2>/dev/null | head -1)

if [ -z "$CONFIG" ]; then
  echo "ERROR: No se encontró archivo de configuración nginx."
  echo "Archivos disponibles:"
  ls /etc/nginx/conf.d/ 2>/dev/null
  ls /etc/nginx/sites-available/ 2>/dev/null
  exit 1
fi

echo "Archivo encontrado: $CONFIG"

# Verificar si ya tiene el proxy configurado
if grep -q "odoo-api" "$CONFIG"; then
  echo "El proxy /odoo-api ya está configurado."
  nginx -t && systemctl reload nginx
  exit 0
fi

# Insertar el bloque proxy ANTES del location / existente
sed -i 's|location / {|location /odoo-api/ {\n        proxy_pass https://srv.seishin.com.mx/;\n        proxy_set_header Host srv.seishin.com.mx;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_ssl_server_name on;\n    }\n\n    location / {|' "$CONFIG"

echo "=== Proxy agregado. Verificando nginx ==="
nginx -t

if [ $? -eq 0 ]; then
  systemctl reload nginx
  echo "=== ✓ Nginx recargado correctamente ==="
else
  echo "ERROR en la configuración. Revirtiendo..."
  git checkout "$CONFIG" 2>/dev/null || echo "Revisa $CONFIG manualmente."
fi

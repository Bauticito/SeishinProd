cat > /var/www/paginatest_preview/update.sh << 'EOF'
#!/bin/bash
cd /var/www/paginatest_preview
git pull origin main
rm -rf node_modules
npm install
npm run build
systemctl reload nginx
EOF
chmod +x /var/www/paginatest_preview/update.sh
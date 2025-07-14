# Guía de Despliegue - IbnSina

## Despliegue en Producción

### Prerrequisitos
- Node.js 16+ instalado en el servidor
- MongoDB configurado y ejecutándose
- Dominio configurado (opcional)
- Certificado SSL (recomendado)

### 1. Preparación del Servidor

#### Instalar Node.js
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

#### Instalar MongoDB
```bash
# Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 2. Configuración del Proyecto

#### Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd IbnSina
```

#### Instalar dependencias
```bash
npm run install-all
```

#### Configurar variables de entorno
```bash
cp .env.example .env
```

Editar `.env` con las configuraciones de producción:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ibnsina
JWT_SECRET=tu_jwt_secret_super_seguro_y_largo_aqui
```

### 3. Construcción para Producción

#### Construir el frontend
```bash
npm run build
```

#### Verificar la construcción
```bash
# El frontend construido estará en client/build/
ls -la client/build/
```

### 4. Configuración del Servidor Web

#### Usando PM2 (Recomendado)
```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar la aplicación
pm2 start server/index.js --name "ibnsina"

# Configurar para iniciar automáticamente
pm2 startup
pm2 save
```

#### Usando systemd
Crear archivo `/etc/systemd/system/ibnsina.service`:
```ini
[Unit]
Description=IbnSina Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/IbnSina
ExecStart=/usr/bin/node server/index.js
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable ibnsina
sudo systemctl start ibnsina
```

### 5. Configuración de Nginx (Opcional)

Crear archivo `/etc/nginx/sites-available/ibnsina`:
```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/ibnsina /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Configuración de SSL (Recomendado)

#### Usando Let's Encrypt
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

### 7. Monitoreo y Logs

#### Verificar logs con PM2
```bash
pm2 logs ibnsina
pm2 monit
```

#### Verificar logs con systemd
```bash
sudo journalctl -u ibnsina -f
```

### 8. Backup de Base de Datos

#### Script de backup automático
Crear `/usr/local/bin/backup-ibnsina.sh`:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/ibnsina"
mkdir -p $BACKUP_DIR
mongodump --db ibnsina --out $BACKUP_DIR/backup_$DATE
find $BACKUP_DIR -name "backup_*" -mtime +7 -delete
```

```bash
chmod +x /usr/local/bin/backup-ibnsina.sh
# Agregar al crontab para ejecutar diariamente
echo "0 2 * * * /usr/local/bin/backup-ibnsina.sh" | crontab -
```

### 9. Actualizaciones

#### Script de actualización
Crear `/usr/local/bin/update-ibnsina.sh`:
```bash
#!/bin/bash
cd /path/to/IbnSina
git pull origin main
npm run install-all
npm run build
pm2 restart ibnsina
```

### 10. Verificación

#### Verificar que la aplicación funciona
```bash
curl http://localhost:5000
# Debería devolver el mensaje de bienvenida
```

#### Verificar la base de datos
```bash
mongo ibnsina --eval "db.stats()"
```

## Desarrollador
- **Rodrigo Álvarez**
- Contacto: incognia@gmail.com 
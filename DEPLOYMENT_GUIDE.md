# 🚀 Deployment Guide - Wdrażanie Produkcyjne

Przewodnik do wdrażania aplikacji Task Management System na serwer produkcyjny.

## Wymagania Produkcyjne

### Hardware
- **Serwer**: Minimum 2GB RAM, 10GB dysku
- **CPU**: Min. 1 core
- **Przepustowość**: Min. 10 Mbps

### Software
- **PHP**: 8.1+
- **MySQL**: 5.7+ lub MariaDB 10.4+
- **Web Server**: Nginx lub Apache
- **SSL**: Let's Encrypt (certbot)

## Kroki Wdrażania

### 1. Przygotowanie Serwera

```bash
# Aktualizacja systemu
sudo apt update && sudo apt upgrade -y

# Instalacja zależności
sudo apt install -y \
    nginx \
    mysql-server \
    php-fpm \
    php-mysql \
    php-mbstring \
    php-xml \
    php-json \
    php-curl \
    php-zip \
    curl \
    git \
    certbot \
    python3-certbot-nginx

# Instalacja Composera
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

### 2. Klonowanie Repozytorium

```bash
# Stwórz katalog aplikacji
sudo mkdir -p /var/www/task-management
cd /var/www/task-management

# Klonuj repozytorium
sudo git clone https://github.com/yourusername/management2.git .

# Ustaw właściciela
sudo chown -R www-data:www-data /var/www/task-management
sudo chmod -R 755 /var/www/task-management
sudo chmod -R 775 /var/www/task-management/storage /var/www/task-management/bootstrap/cache
```

### 3. Instalacja Zależności

```bash
cd /var/www/task-management

# Zainstaluj pakiety Composera
sudo composer install --optimize-autoloader --no-dev

# Ustaw uprawnienia znowu
sudo chown -R www-data:www-data /var/www/task-management
```

### 4. Konfiguracja Środowiska

```bash
# Skopiuj plik .env
sudo cp .env.example .env

# Edytuj .env
sudo nano .env
```

Ustaw:
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_HOST=127.0.0.1
DB_DATABASE=task_management
DB_USERNAME=taskuser
DB_PASSWORD=STRONG_PASSWORD_HERE

JWT_SECRET=$(php artisan key:generate --show)
```

### 5. Konfiguracja Bazy Danych

```bash
# Zaloguj się do MySQL
sudo mysql -u root -p

# Utwórz bazę i użytkownika
CREATE DATABASE task_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'taskuser'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON task_management.* TO 'taskuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 6. Migracja Bazy Danych

```bash
cd /var/www/task-management

# Uruchom migracje
sudo -u www-data php artisan migrate --force

# Seedowanie danych (opcjonalnie)
sudo -u www-data php artisan db:seed
```

### 7. Konfiguracja Nginx

Utwórz plik konfiguracyjny:

```bash
sudo nano /etc/nginx/sites-available/task-management
```

Wklej:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/task-management/public;
    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
    }

    location ~ /\.ht {
        deny all;
    }

    location ~ /\.env {
        deny all;
    }

    gzip on;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss;
}
```

### 8. Aktywacja Strony

```bash
# Stwórz symlink
sudo ln -s /etc/nginx/sites-available/task-management /etc/nginx/sites-enabled/

# Usuń domyślną stronę
sudo rm /etc/nginx/sites-enabled/default

# Sprawdź konfigurację
sudo nginx -t

# Restartuj Nginx
sudo systemctl restart nginx
```

### 9. SSL Certificate (Let's Encrypt)

```bash
# Wygeneruj certyfikat
sudo certbot certify-only --webroot -w /var/www/task-management/public -d yourdomain.com -d www.yourdomain.com

# Automatyczne odnowienie
sudo systemctl enable certbot.timer
```

### 10. Optimizacja PHP

Edytuj `/etc/php/8.1/fpm/php.ini`:

```bash
sudo nano /etc/php/8.1/fpm/php.ini
```

Zmień:
```ini
memory_limit = 512M
post_max_size = 100M
upload_max_filesize = 100M
max_execution_time = 300
```

### 11. Cache i Storage

```bash
cd /var/www/task-management

# Skompiluj konfigurację
sudo -u www-data php artisan config:cache

# Skompiluj routes
sudo -u www-data php artisan route:cache

# Skompiluj views
sudo -u www-data php artisan view:cache

# Oczyść temp
sudo -u www-data php artisan cache:clear
```

### 12. Monitoring i Logi

```bash
# Sprawdź logi aplikacji
tail -f /var/www/task-management/storage/logs/laravel.log

# Sprawdź logi Nginx
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

## Backup & Maintenance

### Automatyczny Backup

Utwórz script `/home/user/backup.sh`:

```bash
#!/bin/bash

BACKUP_DIR="/backups/task-management"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup bazy danych
mysqldump -u taskuser -pPASSWORD task_management > $BACKUP_DIR/db_$DATE.sql

# Backup plików
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /var/www/task-management

# Usuń stare backupy (starsze niż 30 dni)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
```

Ustaw cron:

```bash
# Edytuj crontab
crontab -e

# Dodaj linię (backup codziennie o 2:00)
0 2 * * * /home/user/backup.sh
```

### Aktualizacja Aplikacji

```bash
cd /var/www/task-management

# Pobierz najnowszy kod
sudo git pull origin main

# Zainstaluj nowe zależności
sudo composer install --optimize-autoloader --no-dev

# Uruchom migracje
sudo -u www-data php artisan migrate --force

# Wyczyść cache
sudo -u www-data php artisan cache:clear
sudo -u www-data php artisan config:cache
sudo -u www-data php artisan route:cache
```

## Troubleshooting

### Problem: 502 Bad Gateway

```bash
# Sprawdź status PHP-FPM
sudo systemctl status php8.1-fpm

# Restartuj PHP-FPM
sudo systemctl restart php8.1-fpm
```

### Problem: Permission Denied

```bash
# Napraw uprawnienia
sudo chown -R www-data:www-data /var/www/task-management
sudo chmod -R 755 /var/www/task-management
sudo chmod -R 775 /var/www/task-management/storage
```

### Problem: Database Connection Error

```bash
# Sprawdź połączenie MySQL
mysql -u taskuser -p -h localhost
```

## Checklist Przed Produkcją

- [ ] APP_DEBUG = false
- [ ] APP_ENV = production
- [ ] Silne hasła w .env
- [ ] SSL certyfikat zainstalowany
- [ ] Backup strategie ustawione
- [ ] Logi skonfigurowane
- [ ] Email notyfikacje ustawione
- [ ] iCloud credentials zabezpieczone
- [ ] Rate limiting ustawiony
- [ ] Firewall skonfigurowany

## Performance Tips

1. **Caching**
   ```bash
   php artisan cache:clear
   php artisan config:cache
   ```

2. **Database Indexing**
   ```sql
   ALTER TABLE tasks ADD INDEX(client_id, status);
   ALTER TABLE tasks ADD INDEX(due_date);
   ```

3. **CDN Integration**
   - Umieść statyczne pliki na CDN
   - Użyj CloudFlare

4. **Load Balancing**
   - Ustaw load balancer przed aplikacjami
   - Użyj Redis dla session store

## Security Checklist

- [ ] Firewall skonfigurowany
- [ ] SSH keys zamiast hasła
- [ ] Fail2ban zainstalowany
- [ ] Regular security updates
- [ ] Database encryption
- [ ] API rate limiting
- [ ] CORS properly configured
- [ ] SQL injection prevention verified

---

**Ostatnia aktualizacja**: 2024-05-17

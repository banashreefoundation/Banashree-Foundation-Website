# SSL Certificate Setup for Production

This guide explains how to obtain and configure SSL certificates for your production domain (banashreefoundation.org).

## Prerequisites

Before obtaining SSL certificates, ensure:

1. ✅ **Domain is registered** and you have access to DNS settings
2. ✅ **DNS A record** points to your server's public IP address
   ```
   A    banashreefoundation.org    →    YOUR_SERVER_IP
   A    www.banashreefoundation.org →   YOUR_SERVER_IP
   ```
3. ✅ **Ports 80 and 443** are open in your firewall
4. ✅ **Server is accessible** from the internet

## Method 1: Let's Encrypt with Certbot (Recommended)

Let's Encrypt provides free SSL certificates that are trusted by all major browsers.

### Step 1: Install Certbot

**On Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install certbot
```

**On CentOS/RHEL:**
```bash
sudo yum install certbot
```

**On macOS (for testing):**
```bash
brew install certbot
```

### Step 2: Stop Docker Containers

Certbot needs port 80 to verify domain ownership:

```bash
cd /path/to/AS-Customer-Banashree-Digital
docker-compose down
```

### Step 3: Obtain Certificates

**Option A: Standalone Mode (Recommended)**

This temporarily starts a web server on port 80 for verification:

```bash
sudo certbot certonly --standalone \
  -d banashreefoundation.org \
  -d www.banashreefoundation.org \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email
```

**Option B: Webroot Mode (if you already have a web server running)**

```bash
sudo certbot certonly --webroot \
  -w /var/www/html \
  -d banashreefoundation.org \
  -d www.banashreefoundation.org \
  --email your-email@example.com \
  --agree-tos
```

### Step 4: Copy Certificates to Project

Certbot stores certificates in `/etc/letsencrypt/`. Copy them to your project:

```bash
# Create directory structure
mkdir -p client/nginx/certs/live/banashreefoundation.org

# Copy certificates (requires sudo)
sudo cp /etc/letsencrypt/live/banashreefoundation.org/fullchain.pem \
  client/nginx/certs/live/banashreefoundation.org/

sudo cp /etc/letsencrypt/live/banashreefoundation.org/privkey.pem \
  client/nginx/certs/live/banashreefoundation.org/

# Fix permissions
sudo chown -R $USER:$USER client/nginx/certs/
chmod 644 client/nginx/certs/live/banashreefoundation.org/fullchain.pem
chmod 600 client/nginx/certs/live/banashreefoundation.org/privkey.pem
```

**Alternative: Use symbolic links**

```bash
# Link to Let's Encrypt directory (better for auto-renewal)
sudo ln -s /etc/letsencrypt/live/banashreefoundation.org \
  client/nginx/certs/live/banashreefoundation.org
```

### Step 5: Update docker-compose.yml

If using symbolic links, update the volume mount to access the real certificates:

```yaml
  banashree-client:
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
```

Or keep the current setup if you copied the certificates to `client/nginx/certs/`.

### Step 6: Start Docker Containers

```bash
docker-compose build
docker-compose up -d
```

### Step 7: Verify SSL

Test your SSL configuration:

```bash
# Check certificate
curl -v https://banashreefoundation.org

# SSL Labs test (comprehensive)
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=banashreefoundation.org
```

## Certificate Renewal

Let's Encrypt certificates expire after 90 days. Set up automatic renewal:

### Option 1: Certbot Auto-Renewal (Recommended)

Certbot includes automatic renewal. Test it:

```bash
sudo certbot renew --dry-run
```

If successful, Certbot will automatically renew certificates before they expire.

### Option 2: Manual Renewal with Docker

Create a renewal script `renew-ssl.sh`:

```bash
#!/bin/bash
# Stop containers to free port 80
docker-compose down

# Renew certificates
sudo certbot renew

# Copy new certificates
sudo cp /etc/letsencrypt/live/banashreefoundation.org/fullchain.pem \
  client/nginx/certs/live/banashreefoundation.org/
sudo cp /etc/letsencrypt/live/banashreefoundation.org/privkey.pem \
  client/nginx/certs/live/banashreefoundation.org/
sudo chown -R $USER:$USER client/nginx/certs/
chmod 644 client/nginx/certs/live/banashreefoundation.org/fullchain.pem
chmod 600 client/nginx/certs/live/banashreefoundation.org/privkey.pem

# Restart containers
docker-compose up -d
```

Make it executable and set up a cron job:

```bash
chmod +x renew-ssl.sh

# Add to crontab (runs weekly)
crontab -e
# Add this line:
0 3 * * 0 /path/to/AS-Customer-Banashree-Digital/renew-ssl.sh >> /var/log/ssl-renewal.log 2>&1
```

### Option 3: Zero-Downtime Renewal with Nginx

Keep containers running and use nginx for ACME challenges:

1. Update `client/nginx/nginx.conf` to add this inside the HTTP server block:

```nginx
server {
  listen 80;
  server_name banashreefoundation.org;

  # ACME challenge for Let's Encrypt
  location /.well-known/acme-challenge/ {
    root /var/www/certbot;
  }

  # Redirect everything else to HTTPS
  location / {
    return 301 https://$host$request_uri;
  }
}
```

2. Update `docker-compose.yml`:

```yaml
  banashree-client:
    volumes:
      - ./client/nginx/certs:/etc/letsencrypt:ro
      - ./certbot-webroot:/var/www/certbot
```

3. Renew with webroot:

```bash
sudo certbot renew --webroot -w ./certbot-webroot
docker-compose exec banashree-client nginx -s reload
```

## Method 2: Using Other Certificate Providers

### Cloudflare (if using Cloudflare DNS)

1. Sign up for Cloudflare and add your domain
2. Enable SSL/TLS in Cloudflare dashboard
3. Use "Full (strict)" SSL mode
4. Origin certificates can be generated in Cloudflare dashboard
5. Download certificates and place in `client/nginx/certs/`

### Commercial SSL Providers (GoDaddy, Namecheap, DigiCert, etc.)

1. Purchase SSL certificate from provider
2. Generate Certificate Signing Request (CSR):

```bash
openssl req -new -newkey rsa:2048 -nodes \
  -keyout client/nginx/certs/live/banashreefoundation.org/privkey.pem \
  -out banashreefoundation.org.csr \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=banashreefoundation.org"
```

3. Submit CSR to certificate provider
4. Download issued certificate files
5. Place certificates in the correct location:
   - Certificate + Chain → `fullchain.pem`
   - Private Key → `privkey.pem`

## Method 3: AWS Certificate Manager (ACM)

If hosting on AWS with Load Balancer:

1. Request certificate in ACM console
2. Validate domain ownership (email or DNS)
3. Attach certificate to Application Load Balancer
4. ALB handles SSL termination
5. Update nginx config to listen on HTTP only (ALB forwards to port 80)

## Troubleshooting

### Port 80 Already in Use

```bash
# Find what's using port 80
sudo lsof -i :80

# Stop the service
sudo systemctl stop nginx  # or apache2
```

### Domain Not Resolving

```bash
# Check DNS propagation
dig banashreefoundation.org
nslookup banashreefoundation.org

# Wait for DNS propagation (can take 24-48 hours)
```

### Certificate Not Found Error

```bash
# Verify certificate files exist
ls -la client/nginx/certs/live/banashreefoundation.org/

# Check permissions
stat client/nginx/certs/live/banashreefoundation.org/privkey.pem
```

### Nginx Won't Start

```bash
# Test nginx configuration
docker-compose exec banashree-client nginx -t

# View nginx error logs
docker logs banashree-client
```

## Security Best Practices

1. **Keep certificates private**: Never commit private keys to git
   ```bash
   # Add to .gitignore
   echo "client/nginx/certs/live/*/privkey.pem" >> .gitignore
   ```

2. **Use strong SSL configuration**: Already configured in `nginx.conf`
   - TLS 1.2 and 1.3 only
   - Strong cipher suites
   - HSTS enabled (optional)

3. **Monitor expiration**: Set up monitoring for certificate expiration

4. **Regular renewals**: Automate certificate renewal process

5. **Backup certificates**: Keep backups of certificate files in secure location

## Testing Your SSL Setup

```bash
# Test SSL connection
openssl s_client -connect banashreefoundation.org:443 -servername banashreefoundation.org

# Check certificate expiration
echo | openssl s_client -servername banashreefoundation.org \
  -connect banashreefoundation.org:443 2>/dev/null | \
  openssl x509 -noout -dates

# Test with curl
curl -vI https://banashreefoundation.org
```

## Quick Reference

```bash
# Obtain certificate (Let's Encrypt)
sudo certbot certonly --standalone -d banashreefoundation.org

# Renew certificate
sudo certbot renew

# Check certificate expiration
sudo certbot certificates

# Revoke certificate (if compromised)
sudo certbot revoke --cert-path /etc/letsencrypt/live/banashreefoundation.org/cert.pem

# Delete certificate
sudo certbot delete --cert-name banashreefoundation.org
```

## Additional Resources

- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Certbot Documentation](https://certbot.eff.org/docs/)
- [SSL Labs SSL Test](https://www.ssllabs.com/ssltest/)
- [Mozilla SSL Configuration Generator](https://ssl-config.mozilla.org/)

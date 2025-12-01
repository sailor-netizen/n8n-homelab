# SSL Certificate Setup for sailor.net

## Option 1: Self-Signed Certificate (For Testing/Internal Use)

If you're only using this internally on your network, you can create a self-signed certificate:

```bash
# Create the SSL directory
mkdir -p nginx/ssl

# Generate self-signed certificate (valid for 365 days)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/sailor.net.key \
  -out nginx/ssl/sailor.net.crt \
  -subj "/C=AU/ST=Queensland/L=Brisbane/O=Homelab/CN=*.sailor.net"
```

## Option 2: Let's Encrypt (For Production/Public Use)

If `sailor.net` is publicly accessible, use Let's Encrypt for free SSL certificates:

### Prerequisites:
1. Your domain `sailor.net` must point to your public IP
2. Ports 80 and 443 must be forwarded to your Ubuntu VM (192.168.0.6)

### Steps:

```bash
# Install certbot
sudo apt update
sudo apt install certbot

# Stop nginx temporarily
docker compose stop nginx

# Get wildcard certificate for *.sailor.net
sudo certbot certonly --standalone -d sailor.net -d "*.sailor.net" \
  --preferred-challenges dns

# Copy certificates to nginx/ssl directory
sudo cp /etc/letsencrypt/live/sailor.net/fullchain.pem nginx/ssl/sailor.net.crt
sudo cp /etc/letsencrypt/live/sailor.net/privkey.pem nginx/ssl/sailor.net.key

# Set correct permissions
sudo chown $USER:$USER nginx/ssl/*
chmod 644 nginx/ssl/sailor.net.crt
chmod 600 nginx/ssl/sailor.net.key

# Start nginx
docker compose up -d nginx
```

### Auto-Renewal (Let's Encrypt):

```bash
# Add cron job for auto-renewal
sudo crontab -e

# Add this line:
0 3 * * * certbot renew --quiet && cp /etc/letsencrypt/live/sailor.net/fullchain.pem /opt/automation/nginx/ssl/sailor.net.crt && cp /etc/letsencrypt/live/sailor.net/privkey.pem /opt/automation/nginx/ssl/sailor.net.key && docker restart nginx-proxy
```

## DNS Configuration

Add these DNS records to your domain registrar:

```
Type    Name            Value
A       sailor.net      <YOUR_PUBLIC_IP>
CNAME   n8n-proxmox     sailor.net
CNAME   n8n-homelab     sailor.net
CNAME   n8n-game        sailor.net
CNAME   n8n-ai          sailor.net
```

Or if using local DNS (e.g., Pi-hole):

```
192.168.0.6  n8n-proxmox.sailor.net
192.168.0.6  n8n-homelab.sailor.net
192.168.0.6  n8n-game.sailor.net
192.168.0.6  n8n-ai.sailor.net
```

## Start Everything

```bash
# Start all services
docker compose up -d

# Check nginx logs
docker compose logs nginx

# Test access
curl -k https://n8n-proxmox.sailor.net
```

## Access URLs

After setup, access your n8n instances at:
- https://n8n-proxmox.sailor.net
- https://n8n-homelab.sailor.net
- https://n8n-game.sailor.net
- https://n8n-ai.sailor.net

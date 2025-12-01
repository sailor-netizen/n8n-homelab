# n8n Cluster Template

A production-ready, multi-instance n8n deployment optimized for homelabs. This setup runs 4 isolated n8n instances behind a secure Nginx reverse proxy, all backed by a shared PostgreSQL server.

## Architecture

- **4x n8n Instances**:
  - `n8n-proxmox`: Infrastructure management & alerts.
  - `n8n-homelab`: Home automation & IoT logic.
  - `n8n-game`: Game server management.
  - `n8n-ai`: AI agents & LLM workflows.
- **Database**: PostgreSQL 16 (Shared server, isolated DBs per instance).
- **Proxy**: Nginx with SSL termination & WebSocket support.

## Quick Start

1.  **Copy Template**:
    ```bash
    cp -r docker-templates/n8n-cluster /opt/automation/
    cd /opt/automation/n8n-cluster
    ```

2.  **Configure Environment**:
    ```bash
    cp .env.example .env
    nano .env
    ```
    *Update `N8N_ENCRYPTION_KEY` and passwords!*

3.  **Initialize**:
    ```bash
    # Fix script permissions
    chmod +x init-data.sh
    
    # Create SSL certificates (Self-signed for internal use)
    mkdir -p nginx/ssl
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
      -keyout nginx/ssl/sailor.net.key \
      -out nginx/ssl/sailor.net.crt \
      -subj "/C=AU/ST=Queensland/L=Brisbane/O=Homelab/CN=*.sailor.net"
    chmod 644 nginx/ssl/sailor.net.crt
    chmod 600 nginx/ssl/sailor.net.key
    ```

4.  **Deploy**:
    ```bash
    docker compose up -d
    ```

## Access Points

| Service | URL | Port (Direct) |
|---------|-----|---------------|
| Proxmox | https://n8n-proxmox.sailor.net | 5678 |
| Homelab | https://n8n-homelab.sailor.net | 5679 |
| Game | https://n8n-game.sailor.net | 5680 |
| AI | https://n8n-ai.sailor.net | 5681 |

*Note: Direct ports are HTTP only. Use the domain names for HTTPS.*

## Troubleshooting

- **"Connection Refused"**: Check if Nginx is running: `docker compose ps`.
- **"502 Bad Gateway"**: Nginx is running but can't reach n8n. Check n8n logs: `docker compose logs n8n-proxmox`.
- **Database Errors**: Ensure `init-data.sh` ran correctly. If needed, `docker compose down -v` to reset (WARNING: Deletes data).

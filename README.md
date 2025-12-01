# n8n Homelab Setup

A multi-instance n8n setup using Docker Compose and Nginx reverse proxy.

## Architecture

- **4 n8n Instances**:
  - `n8n-proxmox`: Proxmox Management & Telegram
  - `n8n-homelab`: Homelab Automation
  - `n8n-game`: Game Manager
  - `n8n-ai`: AI & Agents
- **PostgreSQL**: Shared database server with isolated databases for each instance.
- **Nginx**: Reverse proxy with SSL termination.

## Prerequisites

- Docker & Docker Compose
- A domain name (e.g., `sailor.net`)
- DNS records pointing to your server

## Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd <repo-name>
   ```

2. **Configure Environment:**
   Copy the example environment file (you need to create this from your actual .env) and fill in your secrets.
   ```bash
   cp .env.example .env
   nano .env
   ```

3. **Generate SSL Certificates:**
   Follow the instructions in `SSL_SETUP.md`.

4. **Start Services:**
   ```bash
   docker compose up -d
   ```

## Access

- https://n8n-proxmox.yourdomain.com
- https://n8n-homelab.yourdomain.com
- https://n8n-game.yourdomain.com
- https://n8n-ai.yourdomain.com

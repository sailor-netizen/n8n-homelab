# Docker Templates Guide

This directory contains pre-configured Docker Compose templates for various homelab services. Each subfolder represents a complete, self-contained service stack ready for deployment to an LXC container or VM.

## How to Use These Templates

### 1. Copy the Template
Choose the project you want to deploy (e.g., `n8n-cluster`) and copy it to your target machine (LXC/VM).

**Option A: Git Clone (Recommended)**
Clone the entire repo on your server, then navigate to the specific template:
```bash
git clone https://github.com/YOUR_USERNAME/n8n-homelab.git
cd n8n-homelab/docker-templates/n8n-cluster
```

**Option B: SCP / File Transfer**
Copy just the specific folder from your local machine to the server:
```bash
# Example using SCP
scp -r ./docker-templates/n8n-cluster user@192.168.0.X:/opt/automation/
```

### 2. Configure Environment
Every template comes with a `.env.example` file. You must create a `.env` file with your specific secrets.

1.  Enter the project directory:
    ```bash
    cd /opt/automation/n8n-cluster
    ```
2.  Copy the example file:
    ```bash
    cp .env.example .env
    ```
3.  Edit the variables:
    ```bash
    nano .env
    ```
    *Refer to the specific project's `README.md` or comments in `.env` for details on what to change.*

### 3. Deploy
Start the Docker stack:

```bash
docker compose up -d
```

### 4. Verify
Check that all containers are running:
```bash
docker compose ps
```
Check logs if something isn't working:
```bash
docker compose logs -f
```

## Available Templates

- **[n8n-cluster](./n8n-cluster)**: High-availability n8n setup with 4 isolated instances, PostgreSQL, and Nginx reverse proxy with SSL.

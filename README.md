# SailorNet Shipyard ⚓

Welcome to the **Shipyard**! This is the central hub for the **SailorNet** infrastructure, hosting self-hosted projects, automation fleets, and container configurations.

## Projects

### 1. [n8n Cluster](./docker-templates/n8n-cluster)
A robust, multi-instance n8n setup running on Docker Compose.
- **Features**: 4 isolated n8n instances (Proxmox, Homelab, Game, AI), Nginx reverse proxy, SSL termination, and PostgreSQL backend.
- **Status**: Active

## Structure
- `/docker-templates`: Collection of Docker Compose setups for easy deployment.
  - `/n8n-cluster`: The n8n automation cluster.
- `/ai`: AI assistant logs, prompts, and project history.
  - `/prompts`: System prompts organized by AI model (Claude, Grok, GPT, etc.).
  - `CHANGELOG.md`: Project version history.

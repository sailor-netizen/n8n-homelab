### Role: DeepSeek Architect
### Project: SailorNet Shipyard
### Stack: Docker, Nginx, n8n, Postgres

### Logic Constraints
1.  **Consistency**: `ai/CHANGELOG.md` MUST reflect the current state of the repo.
2.  **Security**: Secrets != Code. Secrets == `.env`.
3.  **Network**: Nginx listens on 80/443. 80 redirects to 443.

### Execution Protocol
1.  **LOAD** Context from `ai/CHANGELOG.md`.
2.  **ANALYZE** Request.
3.  **MODIFY** `docker-templates/` or config files.
4.  **COMMIT** Log entry to `ai/CHANGELOG.md`.

# Changelog

All notable changes to the **SailorNet Shipyard** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Crypto Tax Logger Application**: Created complete Electron-based desktop application for cryptocurrency tax compliance
  - Full-stack application with 40+ source files and 3,500+ lines of code
  - React 18 + TypeScript frontend with 6 complete pages (Dashboard, Trade History, Manual Entry, Wallets, Settings, Reports)
  - Professional dark mode design system with modern UI components
  - SQLite database schema for local data storage (trades, wallets, tax lots, disposals)
  - Mock database implementation to bypass better-sqlite3 native module issues
  - Bybit exchange integration using CCXT library for automatic trade fetching
  - Multi-chain wallet tracking: Bitcoin (Blockchair API), Solana (@solana/web3.js), Ethereum (Ethers.js + Etherscan)
  - Australian tax compliance engine with FIFO, LIFO, and Specific Identification methods
  - 50% CGT discount calculation for assets held >12 months
  - Personal use exemption detection ($10,000 AUD threshold)
  - Financial year reporting (July 1 - June 30) with CSV, JSON, and text export
  - Comprehensive documentation (README.md, implementation plan, project summary)
  - Custom Vite build configuration for Electron main, preload, and renderer processes

### Fixed
- **PowerShell Execution Policy**: Set RemoteSigned policy to allow npm scripts
- **Electron Build System**: Replaced problematic electron-vite with standard Vite + custom configurations
- **Node.js Built-ins**: Configured Vite to properly externalize Node.js modules (path, fs, etc.) for main process
- **Electron Externalization**: Fixed Electron module bundling issue by using SSR mode and proper external configuration
- **Nginx Configuration**: Recreated missing Nginx server block configs (`n8n-proxmox.conf`, `n8n-homelab.conf`, `n8n-game.conf`, `n8n-ai.conf`)
- **Nginx Mounting**: Fixed empty `conf.d/` directory issue by regenerating configuration files

### Changed
- **Build System**: Migrated from electron-vite to standard Vite with separate configs for main/preload/renderer
- **Package Scripts**: Updated npm scripts to use concurrently, wait-on, and cross-env for better dev workflow
- **Output Directory**: Changed from `out/` and `dist-electron/` to unified `dist/` structure
- **Repository Structure**: Renamed project from "n8n-homelab" to "SailorNet Shipyard"
- **Project Organization**: Moved n8n project to `docker-templates/n8n-cluster` for better template management
- **Documentation Folder**: Renamed `ai-logs` to `ai` and moved `CHANGELOG.md` inside it
- **Prompts Organization**: Reorganized prompts into model-specific subdirectories (`claude/`, `gpt/`, `grok/`, `mistral/`, `deepseek/`)

### User Prompts (Session Log)
1. "i want to make a application that i can run to log crypto asset trades to files for tax purposes..." - Initial crypto tax logger request
2. "Electron app, Bybit Integration: Both options, WalletConnect: ye track the wallet..." - Confirmed technical requirements
3. "run the app for me" - Attempted to run application
4. "i get this error when running the npm install..." - PowerShell execution policy error
5. "run it for me now" - Request to run after Node.js installation
6. "heelp with option 1" - Request to implement proper Vite build fix
7. "upddat the change log" - Request to update CHANGELOG.md


# Changelog

All notable changes to the **SailorNet Shipyard** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- **Nginx Configuration**: Recreated missing Nginx server block configs (`n8n-proxmox.conf`, `n8n-homelab.conf`, `n8n-game.conf`, `n8n-ai.conf`).
- **Nginx Mounting**: Fixed empty `conf.d/` directory issue by regenerating configuration files.

### Changed
- **Repository Structure**: Renamed project from "n8n-homelab" to "SailorNet Shipyard".
- **Project Organization**: Moved n8n project to `docker-templates/n8n-cluster` for better template management.
- **Documentation Folder**: Renamed `ai-logs` to `ai` and moved `CHANGELOG.md` inside it.
- **Prompts Organization**: Reorganized prompts into model-specific subdirectories (`claude/`, `gpt/`, `grok/`, `mistral/`, `deepseek/`).

### Added
- **Documentation**: Created `README.md` for root, `docker-templates/`, and `docker-templates/n8n-cluster/`.
- **AI Prompts**: Created model-optimized prompts for changelog management and codebase expertise.
  - `changelog-manager` prompts for all 5 AI models (Claude, GPT, Grok, Mistral, DeepSeek).
  - `codebase-expert` prompts for all 5 AI models.
  - `general-codebase-expert.md` as a universal fallback prompt.
  - `ai-router.md` to guide users/agents to the correct prompt file.
- **GitHub Preparation**: Created `.gitignore` and `.env.example` for safe repository sharing.
- **Changelog**: Initialized `CHANGELOG.md` following Keep a Changelog format.
- **Proxmox Setup Guide**: Created `proxmox/README.md` with comprehensive LXC container setup instructions for Docker.

### Removed
- **Cleanup**: Removed redundant `SSL_SETUP.md`, local `README.md`, and `.gitignore` from `n8n-cluster/` folder.

### User Prompts (Session Log)
1. "docker exec nginx-proxy nginx -t" - Verified Nginx configuration syntax
2. "where do i place all of these config files in the lxc" - Clarified deployment location
3. "im going to upload this to git hub tell me aall the steps to do this" - GitHub preparation
4. "this is going to be my home lab repo make this its own project and orginise the folders" - Repository restructuring
5. "lets rename the repo to something with sailor as thats the domain" - Renamed to SailorNet Shipyard
6. "make a chaange log file and folder for the ai chat logs to sit and other ai files" - Created CHANGELOG and ai/ folder
7. "move the change log to the ai folder and change the name for the dfolder ai-logs i dont want the log part" - Renamed ai-logs to ai
8. "make a prompt folder that can be used for makeing the ai chat use the change log" - Created prompts system
9. "make this readable files for cluade code like md.cluade to ustilise the ai feautres" - Added .claude.md extension
10. "i want to make one for each ai like the 10 main ones" - Created model-specific prompt folders
11. "make the files for each ai readable and more acessable for that ai type" - Optimized prompts per model
12. "now make system system prompts for the code base" - Created codebase-expert prompts
13. "make general prompt in the main prompts dir and also make a prompt in at dir for pointing eweach ai to the folder" - Created general prompt and AI router
14. "update the change log with all the update in this chat" - Updated changelog
15. "add the user prompts to this" - Added user prompts section
16. "make sure the change log always adds the user promt" - Updated all changelog manager prompts
17. "make anoter folder called promox and make instructions for getting it reeady for the docker templates" - Created Proxmox setup guide

## [0.1.0] - 2025-12-02
### Added
- **n8n Cluster Template**: Initial release of the 4-instance n8n Docker Compose setup.
- **Nginx Reverse Proxy**: Configured with SSL termination and WebSocket support.
- **Documentation**: Added `README.md` and `docker-templates` guide.
- **Structure**: Reorganized project into `docker-templates/n8n-cluster`.
- **Security**: Added `.gitignore` and `.env.example` to protect secrets.

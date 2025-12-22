# Changelog

All notable changes to the **SailorNet Shipyard** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **TradingView Intelligence Terminal**: Fully migrated the visualization layer to official TradingView widgets.
  - **Advanced Tactical Charts**: Integrated the full TV Advanced Charting widget with 100+ indicators and professional drawing tools.
  - **Global Ticker Tape**: Deployed a persistent real-time market stream in the terminal header.
  - **Neural Market Overview**: Replaced custom ticker cards with a high-density Market Overview console.
  - **Tactical Sidebar Gauges**: Integrated official Technical Analysis and Symbol Info widgets for deep-dive asset metrics.
  - **Live Search Preview**: Added a real-time TradingView uplink to the `AddAssetModal` for instant node verification.
- **Widget Stabilization Engine**: Implemented cross-platform rendering protocols for Electron.
  - **Hydration Guards**: Added 100ms initialization delays to ensure DOM readiness before widget uplink.
  - **Unique ID Isolation**: Implemented dynamic container ID generation to prevent rendering collisions during navigation.
- **Neural Control Pad**: Added interactive sidebar filters for scanning multiple data vectors (Price, Volume, Sentiment).
- **Multi-Vector Telemetry**: Expanded the market simulation engine to provide synchronized Price, Volume, and Sentiment history.
- **Dynamic Timeframe Scanning**: Implemented multi-resolution scanning (1H, 4H, 1D) across the intelligence hub.
- **Market Intelligence Hub**: Transformed the Dashboard into a data-dense "Mainframe Console".
  - **Neural Toolbar**: Compact top-bar navigation that reclaims 90% of screen space.
  - **Intelligence Canvas**: Large interactive preview panel for deep-dive asset tracking.
  - **Real-time Data Engine**: Automatic 5-second polling for live coin and stock prices.
  - **Neon Bar Charts**: Custom terminal-styled visualizations for price and volume trends.
  - **Custom Watchlist**: Functional "Add Node" and "Delete Node" system for customized asset tracking.
  - **AI Neural Snapshots**: Real-time technical analysis and "Oracle Verdicts" for tracked symbols.
- **Type Safety**: Implemented `src/renderer/global.d.ts` to provide proper TypeScript definitions for the `window.api` Electron bridge.
- **WalletConnect**: Integrated `@walletconnect/web3-provider` to allow connecting mobile wallets via QR code.
- **Polyfills**: Added `vite-plugin-node-polyfills` to support Node.js globals (`Buffer`, `process`) in the renderer.
- **Fonts**: Added 'Fira Code' Google Font for the new terminal aesthetic.

### Changed
- **Strategy Pivot**: Transitioned from custom `lightweight-charts` implementation to official professional widgets for superior data fidelity and toolkit access.
- **Telemetry Calibration**: Refined symbol formatting logic across the mainframe to ensure 100% compatibility with TradingView's data network.
- **Reclaimed Canvas**: Optimized CSS layout to ensure widgets resize dynamically when the Neural Watchlist sidebar is toggled.
- **Neural UI Consistency**: Standardized filter switches and bar charts to align with the "Mainframe Console" aesthetic.
- **Terminal UI Redesign**: Complete overhaul of the application theme to a "System Online" / Cyberpunk aesthetic.
  - **Frameless Window**: Removed standard OS frame for a custom desktop experience with integrated titles and traffic lights.
  - **Reusable Modal System**: Created a high-tech modal component with backdrop blur and neon cyan framing.
  - **Integrated WalletConnect**: Built a custom WalletConnect flow that eliminates external pop-ups.
  - **Integrated QR Code**: QR codes now render directly inside the terminal modal with a "Scanning" laser animation.
  - **Quick Action Integration**: Added "Connect Wallet" trigger directly to the Dashboard's Quick Actions.
- **Improved Responsiveness**: Fixed full-height layout issues and added wide-screen content centering.
- **Modular Frontend**: Refactored `Wallets.tsx` and `Dashboard.tsx` to use shared UI components (`WalletConnectModal`).
- **Dev Workflow**: Resolved persistent "Port 9099 already in use" errors and improved dev server stability.

### Fixed
- **Window Controls**: Built functional Minimize, Maximize, and Close buttons for the frameless interface.
- **QR Aesthetic**: Stopped scanline animation automatically when QR is generated for better scan reliability.

### Crypto Tax Logger Application: Created complete Electron-based desktop application for cryptocurrency tax compliance

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
- **Electron Startup**: Fixed `Cannot read properties of undefined (reading 'whenReady')` error by unsetting `ELECTRON_RUN_AS_NODE` environment variable
- **Renderer Loading**: Fixed blank screen issue by configuring fixed port (9099) and passing `ELECTRON_RENDERER_URL` to main process
- **Port Conflicts**: Resolved port 9000/5173 conflicts by moving renderer to port 9099

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
8. "help contiuing fix the cryto logger app..." - Resumed work on crypto logger
9. "continue" - Proceeded with diagnosis and fixes
10. "update the change log" - Request to document fixes


# Changelog

All notable changes to the **SailorNet Shipyard** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **WalletConnect**: Integrated `@walletconnect/web3-provider` to allow connecting mobile wallets via QR code.
- **Polyfills**: Added `vite-plugin-node-polyfills` to support Node.js globals (`Buffer`, `process`) in the renderer.
- **Fonts**: Added 'Fira Code' Google Font for the new terminal aesthetic.

### Changed
- **UI Theme**: Complete redesign to "Colorful Terminal" / Cyberpunk aesthetic (Neon Green/Pink on Black).
- **Styling**: Updated all components (Buttons, Cards, Tables) to use sharp edges and glowing borders.

### Fixed
- **Blank Screen**: Resolved renderer crash by properly polyfilling `global` and `Buffer` for Web3 libraries.
- **Dropdowns**: Fixed unreadable `select`/`option` elements in dark mode.

### Removed
- **Cleanup**: Deleted deprecated `electron.vite.config.ts` which was causing import errors.

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

### Added
- **Market Intelligence Hub**: Transformed the Dashboard into a data-dense "Mainframe Console".
  - **Neural Toolbar**: Compact top-bar navigation that reclaims 90% of screen space.
  - **Intelligence Canvas**: Large interactive preview panel for deep-dive asset tracking.
  - **Real-time Data Engine**: Automatic 5-second polling for live coin and stock prices.
  - **Neon Bar Charts**: Custom terminal-styled visualizations for price and volume trends.
  - **Custom Watchlist**: Functional "Add Node" and "Delete Node" system for customized asset tracking.
  - **AI Neural Snapshots**: Real-time technical analysis and "Oracle Verdicts" for tracked symbols.
- **Type Safety**: Implemented `src/renderer/global.d.ts` to provide proper TypeScript definitions for the `window.api` Electron bridge.

### Changed
- **Navigation Flow**: Replaced the persistent sidebar with a "Hub-first" architecture.
- **Dashboard Refinement**: Moved from large tile-grid to a more professional "Mainframe" layout with compact controls.

### Fixed
- **TypeScript Regression**: Restored accidentally removed React imports and fixed implicit `any` lint errors in `Dashboard.tsx`.
- **Preload Stability**: Fixed syntax errors in `preload/index.ts` caused by accidental markdown noise.
- **Code Quality**: Resolved unused parameter warnings in the `DatabaseManager` mock implementation.

### User Prompts (Session Log)
1. "Dashboard Hub Navigation" - Initiated navigation overhaul.
2. "i want to include a preview make the the control panel smaller and a the top" - Requested compact nav.
3. "i want the preview to actual display below the control header it should default to the main page which should be a coin tracking page" - Defined default state.
4. "i want to be able too add my own coins i want to track and stocks, it should also include a chart and some analysis from the ai and some general kpi/analytics" - Expanded to Market Intelligence Hub.
5. "i want bar chart and real time data" - Specified visualization and data requirements.
6. "yea lets do the plan" - Approved implementation phase.
7. "make the chaart have a filter for the over view so u can select between timeframs and different filter type like vol, etc and also live tickers. should i use trading view charts" - Requested advanced charting and filters.
8. "lets do it" - Approved chart upgrade and lightweight-charts integration.
9. "the chart screen is black" - Reported library version conflict.
10. "for the chart view use a bar chart and mark sure its one where i can addd indicators also have the time frames and add the watch list bar to the right side side bar with a hambuger menu for a toggle, or what ever is ther terminal eqvilent" - Requested OHLC charts and watchlist sidebar.
11. "update the change log" - Documented the transition to high-performance charting.

## [0.1.0] - 2025-12-02
### Added
- **n8n Cluster Template**: Initial release of the 4-instance n8n Docker Compose setup.
- **Nginx Reverse Proxy**: Configured with SSL termination and WebSocket support.
- **Documentation**: Added `README.md` and `docker-templates` guide.
- **Structure**: Reorganized project into `docker-templates/n8n-cluster`.
- **Security**: Added `.gitignore` and `.env.example` to protect secrets.

# Changelog

All notable changes to the **SailorNet Shipyard** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **TradingView Intelligence Terminal**: Fully migrated the visualization layer to official TradingView widgets.
  - **Advanced Tactical Charts**: Integrated the full TV Advanced Charting widget with 100+ indicators and professional drawing tools.
  - **Global Ticker Tape**: Deployed a persistent real-time market stream in the terminal header.
  - **Neural Market Overview**: High-density Market Overview console.
  - **Tactical Sidebar Gauges**: Official Technical Analysis and Symbol Info widgets for deep-dive asset metrics.
- **WalletConnect Integration**: Full cycle of modernization to a "Colorful Terminal" aesthetic with direct QR code rendering.

### Changed
- **Navigation Flow Re-Alignment**: Re-anchored the layout to a pure chart-centric wide-screen interface.
- **Ergonomics Polish**: Refined vertical spacing and padding in the HubHeader and Command Rails.

### Removed
- **Watchlist System (Complete Decommission)**: Systematic removal of the entire Watchlist feature-set.
  - Deleted `WatchlistSidebar.tsx` and `WatchlistWizard.tsx`.
  - Removed all "Vector" management state, logic, and IPC hooks from `MainLayout.tsx` and `Dashboard.tsx`.
  - Purged 200+ lines of obsolete Watchlist-specific CSS from `index.css`.
  - Eliminated the "INITIALIZE_NEW_NODE" and vector selector UI elements.

### Fixed
- **Layout Collisions**: Resolved vertical overlaps in terminal headers by implementing strict flexbox gaps.
- **Resource Cleanup**: Purged unused imports and deprecated components across the renderer.

### User Prompts (Session Log)
1. "i want to make a application that i can run to log crypto asset trades to files for tax purposes..." - Initial request.
2. "Electron app, Bybit Integration..." - Technical requirements.
3. "run the app for me" - Initial run attempt.
4. "Dashboard Hub Navigation" - Initiated navigation overhaul.
5. "make the chaart have a filter for the over view..." - Requested advanced charting.
6. "move the tickers down and make the side bar have a toggle to open and close" - Refined Watchlist ergonomics.
7. "letts delte this watch list and start agin" - Requested list deletion logic.
8. "i want to remove the watch list feature completely" - Initiated full feature decommission.
9. "updadte the change log" - Documented the transition to a pure intelligence hub.

## [0.1.0] - 2025-12-02
### Added
- **n8n Cluster Template**: Initial release of the 4-instance n8n Docker Compose setup.
- **Nginx Reverse Proxy**: Configured with SSL termination and WebSocket support.
- **Documentation**: Added `README.md` and `docker-templates` guide.
- **Security**: Added `.gitignore` and `.env.example` to protect secrets.

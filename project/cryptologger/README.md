# Crypto Tax Logger

A comprehensive Electron-based desktop application for logging cryptocurrency trades and calculating tax obligations according to Australian (QLD) tax laws.

## Features

### 📊 Trade Tracking
- **Exchange Integration**: Automatic trade import from Bybit
- **Wallet Integration**: Track transactions from Bitcoin, Solana, and Ethereum wallets
- **Manual Entry**: Add trades manually for any exchange or transaction
- **Comprehensive History**: View, filter, and search all your trades

### 💰 Tax Compliance
- **Australian Tax Rules**: Implements ATO crypto tax regulations
- **Multiple Calculation Methods**: FIFO, LIFO, and Specific Identification
- **CGT Discount**: Automatic 50% discount for assets held >12 months
- **Personal Use Exemption**: Identifies transactions under $10,000 AUD
- **Financial Year Reports**: Generate reports for Australian FY (July 1 - June 30)

### 🔐 Security & Privacy
- **Local Storage**: All data stored locally using SQLite
- **Encrypted API Keys**: Exchange API keys encrypted using Electron's safeStorage
- **No Cloud Sync**: Your data never leaves your computer

### 📄 Export Options
- **CSV**: Import into Excel or tax software
- **JSON**: Data portability and backup
- **PDF**: Human-readable tax reports

## Installation

### Prerequisites

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

### Setup

1. **Install Dependencies**
   ```bash
   cd c:\Users\Intel Nuc\Downloads\sailornet-shipyard\project\cryptologger
   npm install
   ```

2. **Build Native Modules**
   ```bash
   npm run postinstall
   ```

## Usage

### Development Mode

Run the application in development mode with hot reload:

```bash
npm run dev
```

### Build for Production

Create a distributable Windows executable:

```bash
npm run build
npm run package:win
```

The built application will be in the `release` folder.

## Configuration

### Bybit API Setup

1. Log in to Bybit
2. Go to API Management
3. Create a **READ-ONLY** API key
4. Copy the API Key and Secret
5. In the app, go to Settings → Bybit Integration
6. Paste your keys and save

### Wallet Connection

1. Go to Wallets page
2. Click "Add Wallet"
3. Select blockchain (BTC, SOL, or ETH)
4. Enter your wallet address
5. Click "Add Wallet"
6. Click "Sync" to fetch transactions

## Project Structure

```
cryptologger/
├── src/
│   ├── main/              # Electron main process
│   │   ├── index.ts       # Main entry point
│   │   ├── database/      # SQLite database layer
│   │   ├── integrations/  # Exchange integrations (Bybit)
│   │   ├── wallets/       # Blockchain wallet trackers
│   │   └── tax/           # Tax calculation engine
│   ├── renderer/          # React UI
│   │   ├── App.tsx        # Main app component
│   │   ├── pages/         # Page components
│   │   └── index.css      # Styles
│   ├── preload/           # Preload scripts (IPC bridge)
│   └── shared/            # Shared types and utilities
├── database/
│   └── schema.sql         # Database schema
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## Tax Calculation Methods

### FIFO (First In, First Out)
- Sells oldest acquired assets first
- Most common method
- Generally results in higher gains (if prices are rising)

### LIFO (Last In, First Out)
- Sells most recently acquired assets first
- Can reduce short-term gains
- May result in lower tax liability

### Specific Identification
- Manually select which tax lot to use
- Requires detailed record-keeping
- Maximum flexibility

## Australian Tax Rules

### Capital Gains Tax (CGT)
- Applies to all crypto-to-crypto and crypto-to-fiat trades
- 50% discount for assets held >12 months
- Losses can offset gains

### Personal Use Exemption
- Transactions under $10,000 AUD may be exempt
- Only if crypto was used for personal purposes
- Consult a tax professional for eligibility

### Financial Year
- Runs from July 1 to June 30
- Reports generated for each FY

## Troubleshooting

### Database Issues
- Database location: `%APPDATA%\cryptologger\cryptologger.db`
- Backup regularly using Settings → Export Database

### API Rate Limits
- Public blockchain APIs have rate limits
- Avoid syncing wallets too frequently
- Consider using your own RPC endpoints for high volume

### Missing Transactions
- Ensure wallet addresses are correct
- Check that the wallet has public transaction history
- Some privacy coins may not work with public APIs

## Disclaimer

**This application is for record-keeping purposes only and does not constitute tax advice.**

Tax laws are complex and subject to change. Always consult with a qualified tax professional or accountant before lodging your tax return.

The developers of this application are not responsible for any tax-related decisions or consequences resulting from the use of this software.

## Support

For issues or questions:
1. Check this README
2. Review the in-app help sections
3. Consult the ATO website: https://www.ato.gov.au/

## License

MIT License - See LICENSE file for details

## Version

1.0.0 - Initial Release

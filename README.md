# Flash Network

TRON-based wallet and transaction API with FLASH ERC20 token support.

## Features

- User authentication (JWT)
- TRON wallet creation with AES-256-CBC encrypted private keys
- Send TRX transactions
- Automatic deposit scanning (TRC20)
- Automatic transaction confirmation worker
- FLASH ERC20 smart contract (mint, burn, freeze, blacklist)

## Prerequisites

- Node.js >= 18
- PostgreSQL
- TRON API key (https://www.trongrid.io)

## Setup

```bash
# Install dependencies
npm install

# Copy env example and fill in your values
cp .env.example .env

# Initialize database
psql $DATABASE_URL -f src/database/schema.sql

# Start the server
npm start

# Development (auto-reload)
npm run dev
```

## Environment Variables

See `.env.example` for all required variables.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and get JWT |
| GET | `/user/me` | Get current user info |
| POST | `/wallet/create` | Create a TRON wallet |
| GET | `/wallet/me` | Get user's wallet |
| GET | `/wallet/balance` | Get wallet TRX balance |
| POST | `/transaction/send` | Send TRX |
| GET | `/transaction/history` | Get transaction history |

## Smart Contract

The FLASH token contract is in `contracts/FLASH.sol`.

### Deploy on Nile Testnet

```bash
# Deploy the FLASH contract (updates .env automatically)
npm run deploy:flash
```

The deploy script compiles the Solidity contract with solc, deploys it via TronWeb on Nile, and writes the contract address to `FLASH_CONTRACT_ADDRESS` in `.env`.

### Test FLASH deposit

```bash
# Send FLASH tokens to a wallet (triggers deposit scanner)
npm run test:deposit
```

This uses `TEST_PRIVATE_KEY` (or `PRIVATE_KEY`) to send FLASH TRC20 tokens to `TEST_TO_ADDRESS` via `contract.transfer()`. The deposit worker will detect the transaction on the next scan cycle.

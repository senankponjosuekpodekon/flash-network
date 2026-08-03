# Flash Network

TRON-based wallet and transaction API with FLASH ERC20 token support.

## Features

- User authentication (JWT)
- TRON wallet creation with AES-256-CBC encrypted private keys
- Send TRX transactions
- Automatic deposit scanning (TRC20 FLASH)
- Automatic transaction confirmation worker
- Internal FLASH balance (off-chain)
- Internal transfers between users (off-chain)
- Blockchain withdrawals (FLASH TRC20)
- FLASH ERC20 smart contract (mint, burn, freeze, blacklist, confiscate)
- Admin token management (mint, burn, freeze, blacklist, confiscate)
- User FLASH on-chain operations (balance, send)
- Testnet faucet (1000 FLASH per new wallet)
- Admin token metadata update (rename token)
- Configurable TRON network (Nile / Mainnet)
- Docker + docker-compose support
- Swagger / OpenAPI documentation
- Health check endpoint
- CI/CD via GitHub Actions
- Automated tests (vitest)

## Prerequisites

- Node.js >= 18
- PostgreSQL
- TRON API key (https://www.trongrid.io)

## Setup

### Option 1: Docker (recommended)

```bash
# Copy env and fill in your values
cp .env.example .env

# Start API + PostgreSQL
docker-compose up -d

# API available at http://localhost:3000
# Swagger UI at http://localhost:3000/api-docs/ui
```

### Option 2: Manual

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

# Run tests
npm test
```

## Environment Variables

See `.env.example` for all required variables.

## API Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/auth/register` | Register a new user | - |
| POST | `/auth/login` | Login and get JWT | - |
| GET | `/user/me` | Get current user info | User |
| POST | `/wallet/create` | Create a TRON wallet | User |
| GET | `/wallet/me` | Get user's wallet | User |
| GET | `/wallet/balance` | Get wallet TRX balance | User |
| POST | `/transaction/send` | Send TRX | User |
| GET | `/transaction/history` | Get transaction history | User |
| GET | `/balance` | Get internal FLASH balance | User |
| POST | `/balance/transfer` | Transfer FLASH to another user (off-chain) | User |
| POST | `/withdraw` | Withdraw FLASH to external wallet (on-chain) | User |
| GET | `/token/info` | Get FLASH token info (name, supply, decimals) | - |
| GET | `/token/balance` | Get on-chain FLASH balance | User |
| POST | `/token/send` | Send FLASH on-chain to any TRON address | User |
| GET | `/admin/token-info` | Get token info (admin) | Admin |
| POST | `/admin/mint` | Mint FLASH to an address | Admin |
| POST | `/admin/burn` | Burn FLASH from owner wallet | Admin |
| POST | `/admin/freeze` | Freeze a wallet | Admin |
| POST | `/admin/unfreeze` | Unfreeze a wallet | Admin |
| POST | `/admin/blacklist` | Blacklist an address | Admin |
| POST | `/admin/remove-blacklist` | Remove from blacklist | Admin |
| POST | `/admin/confiscate` | Confiscate all tokens from an address | Admin |
| POST | `/admin/update-metadata` | Update token name and symbol | Admin |
| POST | `/faucet/claim` | Claim 1000 FLASH (testnet faucet) | User |
| GET | `/health` | Health check (API + DB status) | - |
| GET | `/api-docs` | OpenAPI spec (JSON) | - |
| GET | `/api-docs/ui` | Swagger UI (interactive docs) | - |

## Smart Contract

The FLASH token contract is in `contracts/FLASH.sol`.

### Deploy on Nile Testnet

```bash
# Deploy the FLASH contract (updates .env automatically)
npm run deploy:flash
```

The deploy script compiles the Solidity contract with solc, deploys it via TronWeb, and writes the contract address to `FLASH_CONTRACT_ADDRESS` in `.env`.

### Deploy on Mainnet

Set `TRON_NETWORK=mainnet` in `.env`, then:

```bash
npm run deploy:flash
```

⚠️ Mainnet deployment requires real TRX for gas fees.

### Switching networks

Set `TRON_NETWORK` in `.env`:

- `nile` — Nile Testnet (default)
- `mainnet` — TRON Mainnet

### Test FLASH deposit

```bash
# Send FLASH tokens to a wallet (triggers deposit scanner)
npm run test:deposit
```

This uses `TEST_PRIVATE_KEY` (or `PRIVATE_KEY`) to send FLASH TRC20 tokens to `TEST_TO_ADDRESS` via `contract.transfer()`. The deposit worker will detect the transaction on the next scan cycle.

## Trust Wallet Integration

To make FLASH visible in Trust Wallet:

1. Deploy the contract on mainnet (`TRON_NETWORK=mainnet`)
2. Submit a PR to [trustwallet/assets](https://github.com/trustwallet/assets) with:
   - Contract address
   - Token symbol, name, decimals
   - Logo (256x256 PNG)
3. Once merged, Trust Wallet auto-detects FLASH for any address holding the token

## Token Metadata Update

The owner can rename the token at any time:

```bash
curl -X POST http://localhost:3000/admin/update-metadata \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Flash Network", "symbol": "FLASH"}'
```

# Flash Network

TRON-based wallet and transaction platform with FLASH TRC20 token support, React frontend, and Docker deployment.

## Features

### Backend
- User authentication (JWT)
- TRON wallet creation with AES-256-CBC encrypted private keys
- Send TRX transactions
- Automatic deposit scanning (TRC20 FLASH)
- Automatic transaction confirmation worker
- Internal FLASH balance (off-chain)
- Internal transfers between users (off-chain, atomic DB transactions)
- Blockchain withdrawals (FLASH TRC20)
- FLASH TRC20 smart contract (mint, burn, freeze, blacklist, confiscate)
- Admin token management (mint, burn, freeze, blacklist, confiscate, metadata update)
- User FLASH on-chain operations (balance, send)
- Testnet faucet (1000 FLASH per new wallet)
- Admin token metadata update (rename token on-chain)
- Configurable TRON network (Nile / Mainnet)
- Docker + docker-compose support
- Swagger / OpenAPI documentation
- Health check endpoint
- CI/CD via GitHub Actions
- Automated tests (vitest)
- Per-request TronWeb instances (no race conditions)
- Pagination on transaction history
- Configurable worker processes (WORKERS_ENABLED)
- Rate limiting on auth routes

### Frontend
- React + Vite + TailwindCSS
- Responsive mobile-first design (hamburger menu, cards on mobile)
- Auth (Login / Register) with JWT
- Dashboard (internal + on-chain balances, token info, quick actions)
- Wallet management (create, view address, TRX balance)
- Send TRX, Transfer FLASH (internal), Withdraw FLASH (on-chain), Send FLASH (on-chain)
- Transaction history (responsive table/cards)
- Faucet page (claim test FLASH)
- Admin panel (mint, burn, freeze, blacklist, confiscate, update metadata)
- Toast notifications via React Context
- Protected routes with redirect
- 404 page
- Accessibility (focus-visible, aria-labels, role=alert)

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

### Frontend

```bash
cd frontend
npm install
npm run dev    # Dev server at http://localhost:5173
npm run build  # Production build to frontend/dist/
```

The frontend proxies `/api/*` to `http://localhost:3000` during development.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | JWT signing secret |
| `ENCRYPTION_KEY` | Yes | AES-256-CBC key for private key encryption |
| `PRIVATE_KEY` | Yes | Deployer/owner TRON private key |
| `TRON_API_KEY` | Yes | TronGrid API key |
| `FLASH_CONTRACT_ADDRESS` | Yes | FLASH TRC20 contract address |
| `TRON_NETWORK` | No | `nile` (default) or `mainnet` |
| `CORS_ORIGIN` | No | Comma-separated allowed origins (default: none) |
| `WORKERS_ENABLED` | No | `false` to disable background workers (default: enabled) |
| `ADMIN_WALLET_ADDRESS` | No | Admin wallet address for admin middleware |

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
| GET | `/transaction/history` | Get transaction history (paginated) | User |
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

### Étape 1 : Déployer sur Mainnet

```bash
# Dans .env
TRON_NETWORK=mainnet
PRIVATE_KEY=<votre clé privée mainnet>

# Déployer le contrat
npm run deploy:flash
```

### Étape 2 : Ajouter FLASH manuellement dans Trust Wallet

Trust Wallet supporte les tokens TRC20. Vous pouvez ajouter FLASH manuellement :

1. Ouvrez **Trust Wallet** sur mobile
2. Allez dans **Settings → Wallets → Add Custom Token**
3. Sélectionnez **TRON** comme réseau
4. Entrez l'**adresse du contrat FLASH** (disponible via `GET /token/info` ou dans `.env`)
5. Le nom, symbole et décimales s'auto-remplissent si le contrat retourne les métadonnées
6. Confirmez — FLASH apparaît dans votre wallet

### Étape 3 : Envoyer/recevoir FLASH avec Trust Wallet

- **Recevoir** : Utilisez l'adresse TRON de votre Trust Wallet comme destination dans l'app :
  - `POST /withdraw` (retirer du solde interne vers Trust Wallet)
  - `POST /token/send` (envoyer FLASH on-chain vers Trust Wallet)
  - `POST /admin/mint` (admin mint directement vers Trust Wallet)

- **Envoyer** : Depuis Trust Wallet, envoyez FLASH vers l'adresse du wallet de l'app :
  - Le **deposit scanner** détecte automatiquement la transaction
  - Le solde interne est crédité après confirmation

### Étape 4 : Listing officiel (optionnel)

Pour que FLASH soit auto-détecté par tous les utilisateurs Trust Wallet :

1. Soumettez une PR sur [trustwallet/assets](https://github.com/trustwallet/assets) avec :
   - Adresse du contrat (mainnet)
   - Symbole, nom, décimales
   - Logo 256x256 PNG
2. Une fois mergé, Trust Wallet détecte FLASH automatiquement pour tout wallet qui détient le token

### Étape 5 : Vérifier le token sur Tronscan

1. Allez sur [tronscan.org](https://tronscan.org)
2. Cherchez l'adresse du contrat
3. Vérifiez le code source (Submit Contract Verification)
4. Ajoutez le logo et les infos du token

## Token Metadata Update

The owner can rename the token at any time (on-chain):

```bash
curl -X POST http://localhost:3000/admin/update-metadata \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Flash Network", "symbol": "FLASH"}'
```

This calls `updateMetadata()` on the smart contract, which emits an event and updates the token name/symbol on-chain. Trust Wallet and Tronscan will reflect the new name after re-sync.

## Architecture

```
flash-network/
├── src/
│   ├── app.js              # Express entry point
│   ├── config/tron.js      # TronWeb singleton + createTronWeb() + getFlashContract()
│   ├── database/           # PG pool + schema
│   ├── middleware/         # auth, admin, validate, error, rateLimiter
│   ├── repositories/       # user, wallet, transaction, balance
│   ├── services/           # user, wallet, balance, transaction, deposit, transfer, withdraw, admin, token, faucet
│   ├── routes/             # auth, user, wallet, transaction, balance, withdraw, admin, token, faucet, health, api-docs
│   ├── workers/            # confirmation, deposit (conditional via WORKERS_ENABLED)
│   └── utils/crypto.js     # AES-256-CBC encrypt/decrypt
├── frontend/
│   ├── src/
│   │   ├── contexts/       # AuthContext, ToastContext
│   │   ├── components/     # Layout, ProtectedRoute, Toast
│   │   ├── pages/          # Login, Dashboard, Wallet, Send, Transfer, Withdraw, TokenSend, History, Faucet, Admin, NotFound
│   │   ├── lib/api.js      # API client
│   │   └── App.jsx         # Router
│   └── vite.config.js      # Proxy → backend
├── contracts/FLASH.sol     # TRC20 smart contract
├── Dockerfile + docker-compose.yml
├── .github/workflows/ci.yml
└── tests/                  # vitest (contracts + services)
```

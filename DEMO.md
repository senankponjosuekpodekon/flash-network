# Flash Network — Demo Investisseur

## Pitch rapide (30 secondes)

**Flash Network** est une plateforme de wallet et de transactions sur la blockchain TRON, centrée sur le token TRC20 **FLASH**.

- **Utilisateurs** : création automatique de wallets TRON, solde interne FLASH, transferts instantanés off-chain, retraits on-chain vers n'importe quelle adresse TRON.
- **Admin** : mint, burn, freeze, blacklist, confiscate, mise à jour des métadonnées du token.
- **Architecture** : backend Node.js/Express + PostgreSQL, frontend React/Vite/Tailwind, smart contract TRON TRC20, déploiement Docker.

Cible : fintech, inclusion financière, paiements cross-border, tokenisation.

---

## URLs de démonstration

| Service | URL |
|---------|-----|
| Frontend | `http://localhost:5173` |
| API | `http://localhost:3000` |
| Swagger / API docs | `http://localhost:3000/api-docs/ui` |
| Health check | `http://localhost:3000/health` |

---

## Comptes de démo

Deux comptes sont créés pour la démo :

- **Alice** : `demo@investor.com` / `DemoPass123!` — solde interne 900 FLASH
- **Bob** : `bob@investor.com` / `DemoPass123!` — solbre interne 100 FLASH

Contrat FLASH (Nile testnet) : `TT2izXuC9kdhuQj1jq6jR6jtL5NEbZvKwu`

---

## Scénario de démo (5 minutes)

### 1. Vue d'ensemble — Dashboard (1 min)

1. Ouvrir `http://localhost:5173`.
2. Se connecter avec `demo@investor.com` / `DemoPass123!`.
3. Montrer le Dashboard :
   - solde interne FLASH
   - solde TRX du wallet
   - infos du token (nom, supply, décimales)
   - actions rapides (Send TRX, Transfer, Withdraw, Faucet)

### 2. Création de wallet (30 s)

1. Aller dans **Wallet**.
2. Cliquer sur **Create Wallet** si ce n'est pas déjà fait.
3. Montrer l'adresse TRON générée et le solde TRX.

### 3. Faucet — recevoir 1000 FLASH (1 min)

1. Aller dans **Faucet**.
2. Cliquer sur **Claim 1000 FLASH**.
3. Le backend mint des tokens on-chain via le wallet admin.
4. Le **deposit scanner** détecte automatiquement le dépôt et crédite le solde interne.
5. Revenir au Dashboard, rafraîchir : le solde interne a augmenté.

### 4. Transfert interne instantané (1 min)

1. Aller dans **Transfer**.
2. Renseigner `bob@investor.com` et un montant (ex : 100 FLASH).
3. Valider → transfert immédiat, sans frais de blockchain.
4. Aller dans **History** pour montrer les transactions IN/OUT.
5. Se connecter avec `bob@investor.com` et vérifier que le solde a augmenté.

### 5. Retrait on-chain / Trust Wallet (1 min)

1. Aller dans **Withdraw**.
2. Renseigner une adresse TRON externe (ex : wallet Trust Wallet de test).
3. Valider → le backend signe et broadcaste une transaction TRC20 on-chain.
4. La transaction est suivie par le **confirmation worker** et l'historique est mis à jour.

### 6. Admin / Token management (30 s)

1. Se connecter avec le compte admin (adresse configurée dans `.env`).
2. Aller dans **Admin**.
3. Montrer :
   - Mint / Burn
   - Freeze / Unfreeze
   - Blacklist / Remove blacklist
   - Confiscate
   - Update metadata (renommer le token on-chain)

### 7. Swagger — API documentée (30 s)

1. Ouvrir `http://localhost:3000/api-docs/ui`.
2. Montrer que toutes les routes sont documentées et testables.

---

## Points clés pour l'investisseur

- **Sécurité** : clés privées chiffrées AES-256-CBC, JWT, rate limiting, CORS explicite.
- **Scalabilité** : pool PostgreSQL configuré, pagination, workers conditionnels.
- **Fiabilité** : transactions atomiques, contraintes UNIQUE, tests unitaires (vitest).
- **Blockchain** : TRON pour faibles frais et haute vitesse, token TRC20 custom.
- **UX** : frontend responsive mobile-first, PWA possible, Swagger intégré.
- **Déploiement** : Docker + docker-compose, CI/CD GitHub Actions.

---

## Commandes de lancement

```bash
# Backend
cd /home/josue/Projections/flash-network
node src/app.js

# Frontend
cd /home/josue/Projections/flash-network/frontend
npm run dev
```

---

## Commandes curl de test rapide

```bash
# Health
curl http://localhost:3000/health

# Token info
curl http://localhost:3000/token/info

# Login Alice
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@investor.com","password":"DemoPass123!"}' \
  | sed -E 's/.*"token":"([^"]+)".*/\1/')

# Balance
curl -s http://localhost:3000/balance -H "Authorization: Bearer $TOKEN"

# Transfer 100 FLASH to Bob
curl -s -X POST http://localhost:3000/balance/transfer \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"to":"bob@investor.com","amount":"100000000000000000000"}'

# History
curl -s 'http://localhost:3000/transaction/history?page=1&limit=10' \
  -H "Authorization: Bearer $TOKEN"
```

---

## Notes pour le démonstrateur

- Le projet tourne sur le **testnet TRON Nile**. Aucun TRX réel n'est utilisé.
- Les wallets sont générés côté serveur pour la démo ; en production, l'application peut s'intégrer avec Trust Wallet / TronLink en mode non-custodial.
- Le retrait on-chain nécessite un peu de TRX (energy/bandwidth) dans le wallet source. Pour la démo, utiliser le faucet Nile ou pré-fund le wallet.
- Si le backend est redémarré, les workers reprennent automatiquement le scan des dépôts et confirmations.

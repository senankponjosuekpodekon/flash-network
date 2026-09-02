# Flash Network — Guide de Déploiement en Production (Mainnet)

> Ce guide couvre le passage du testnet Nile au mainnet TRON pour une mise en production sécurisée de Flash Network.

---

## 1. Prérequis

### Infrastructure

| Composant | Version / Spécification |
|-----------|--------------------------|
| Node.js | >= 18 LTS |
| PostgreSQL | >= 14 |
| TRON API key | TronGrid Pro recommandé pour production |
| Domaine + HTTPS | Obligatoire pour le frontend et l'API |
| Serveur | VPS / Cloud (2 vCPU, 4 Go RAM minimum) |
| Wallet admin | Wallet TRON avec TRX réels pour le gas |

### Fichiers nécessaires

- `.env` configuré
- `docker-compose.yml` (optionnel)
- Clés SSH / accès serveur
- Backup automatisé de la base de données

---

## 2. Configuration de l'environnement

### 2.1 Créer le fichier `.env`

```bash
cp .env.example .env
```

### 2.2 Variables obligatoires pour le mainnet

```env
# Réseau
TRON_NETWORK=mainnet

# Base de données
DATABASE_URL=postgresql://user:password@localhost:5432/flash_network

# Sécurité
JWT_SECRET=<générer avec openssl rand -base64 64>
ENCRYPTION_KEY=<clé AES-256-CBC, 32 bytes en hex>

# Blockchain
PRIVATE_KEY=<clé privée du wallet admin mainnet>
TRON_API_KEY=<clé TronGrid Pro>
ADMIN_WALLET_ADDRESS=<adresse TRON du wallet admin>

# Contrat (sera rempli au déploiement)
FLASH_CONTRACT_ADDRESS=

# CORS
CORS_ORIGIN=https://votredomaine.com,https://app.votredomaine.com

# Workers
WORKERS_ENABLED=true
```

> ⚠️ **Ne jamais committer `.env`**. Utilisez un gestionnaire de secrets (Vault, AWS Secrets Manager, 1Password, etc.).

---

## 3. Déploiement du smart contract sur Mainnet

### 3.1 Vérifier le solde en TRX

Le wallet admin doit disposer de TRX réels pour payer les frais de déploiement (bande passante et énergie).

```bash
node -e "
import('tronweb').then(async ({TronWeb}) => {
  const t = new TronWeb({
    fullHost: 'https://api.trongrid.io',
    headers: { 'TRON-PRO-API-KEY': process.env.TRON_API_KEY },
    privateKey: process.env.PRIVATE_KEY
  });
  const addr = t.address.fromPrivateKey(process.env.PRIVATE_KEY);
  const bal = await t.trx.getBalance(addr);
  console.log(addr, bal / 1e6, 'TRX');
});
"
```

### 3.2 Déployer le contrat FLASH

```bash
npm run deploy:flash
```

Le script :
1. Compile `contracts/FLASH.sol` avec solc.
2. Déploie sur le mainnet via TronWeb.
3. Écrit l'adresse dans `.env` comme `FLASH_CONTRACT_ADDRESS`.

### 3.3 Vérifier le contrat sur Tronscan

1. Allez sur [tronscan.org](https://tronscan.org).
2. Recherchez l'adresse du contrat.
3. Soumettez la vérification du code source (Submit Contract Verification).
4. Ajoutez le logo et les métadonnées du token (nom, symbole, site web, socials).

---

## 4. Déploiement de l'API

### 4.1 Installation

```bash
npm ci --production
```

### 4.2 Initialisation de la base de données

```bash
psql $DATABASE_URL -f src/database/schema.sql
```

### 4.3 Lancer l'API en production

Avec Docker (recommandé) :

```bash
docker-compose up -d
```

Ou manuellement avec PM2 / systemd :

```bash
npm install -g pm2
pm2 start src/app.js --name flash-api
pm2 save
pm2 startup
```

### 4.4 Vérifier le health check

```bash
curl https://api.votredomaine.com/health
```

---

## 5. Déploiement du Frontend

### 5.1 Build de production

```bash
cd frontend
npm install
npm run build
```

### 5.2 Servir avec Nginx

```nginx
server {
    listen 80;
    server_name app.votredomaine.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name app.votredomaine.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    root /var/www/flash-network/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 6. Sécurité

### 6.1 Checklist avant ouverture

- [ ] HTTPS partout (certificats valides).
- [ ] `CORS_ORIGIN` limité aux domaines officiels.
- [ ] `JWT_SECRET` d'au moins 256 bits.
- [ ] `ENCRYPTION_KEY` stockée hors du repo.
- [ ] `PRIVATE_KEY` dans un HSM / vault, jamais en clair.
- [ ] Rate limiting activé sur `/auth/*`.
- [ ] Logs d'audit conservés.
- [ ] Backup quotidien de PostgreSQL.
- [ ] Monitoring des workers (deposit, confirmation).
- [ ] Audit externe du smart contract.

### 6.2 Secrets recommandés

| Secret | Où le stocker |
|--------|---------------|
| `PRIVATE_KEY` | Hardware Security Module, AWS KMS, Azure Key Vault |
| `ENCRYPTION_KEY` | Vault, HashiCorp Vault, ou variable d'environnement chiffrée |
| `JWT_SECRET` | Vault ou gestionnaire de secrets |
| `TRON_API_KEY` | Variables d'environnement |

---

## 7. Mise à jour du token sur Tronscan et Trust Wallet

### 7.1 Tronscan

1. Connectez le wallet admin à Tronscan.
2. Allez sur la page du contrat.
3. Mettez à jour les métadonnées (nom, symbole, description, site web).
4. Soumettez le logo (PNG 256x256).

### 7.2 Trust Wallet (auto-détection)

Pour que FLASH apparaisse automatiquement dans Trust Wallet :

1. Créez une PR sur [trustwallet/assets](https://github.com/trustwallet/assets).
2. Fournissez :
   - Adresse du contrat mainnet
   - Nom, symbole, décimales
   - Logo 256x256 PNG
   - Site web et liens sociaux
3. Une fois mergé, Trust Wallet détectera FLASH pour tous les détenteurs.

### 7.3 Ajout manuel dans Trust Wallet

En attendant la PR :

1. Trust Wallet → Settings → Wallets → Add Custom Token
2. Network : TRON
3. Contract address : `FLASH_CONTRACT_ADDRESS`
4. Les métadonnées se remplissent automatiquement si le contrat est vérifié.

---

## 8. Monitoring & Maintenance

### 8.1 Logs

```bash
pm2 logs flash-api
```

### 8.2 Health check

```bash
curl https://api.votredomaine.com/health
```

### 8.3 Métriques à surveiller

- Load moyen, RAM, disque.
- Nombre de requêtes / erreurs 500.
- File des transactions en attente.
- Solde TRX du wallet admin.
- Gas fees moyens.

### 8.4 Backup

```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
```

Automatiser via `cron` ou un service cloud.

---

## 9. Checklist Go-Live

- [ ] Contrat déployé et vérifié sur Tronscan.
- [ ] API accessible en HTTPS avec health OK.
- [ ] Frontend buildé et servi en HTTPS.
- [ ] Base de données initialisée et indexée.
- [ ] Workers lancés (`WORKERS_ENABLED=true`).
- [ ] Solde TRX suffisant sur le wallet admin.
- [ ] Tests de bout en bout passés (register, faucet, transfer, withdraw).
- [ ] Documentation utilisateur prête.
- [ ] Support / canal de contact disponible.
- [ ] Plan d'incident défini.

---

## 10. Coûts estimés (mainnet)

| Poste | Coût indicatif |
|-------|----------------|
| TRX pour déploiement contract | ~100-300 TRX |
| TRX pour transactions quotidiennes | Variable selon le volume |
| TronGrid API Pro | ~50-200 $/mois |
| Hébergement VPS/Cloud | 50-500 $/mois |
| Audit smart contract | 5 000-20 000 $ |
| Backup & monitoring | 20-100 $/mois |

---

## 11. Support

- **Swagger** : `https://api.votredomaine.com/api-docs/ui`
- **README** : `README.md`
- **Démo** : `DEMO.md`
- **Pitch** : `PITCH.md`

---

## 12. Déploiement MVP gratuit

Stack choisi :

```
Frontend (Netlify) → Backend API (Render) → DB (Neon) → TronGrid API
```

### 12.1 Base de données — Neon

1. Créer un compte sur [neon.tech](https://neon.tech).
2. Créer un nouveau projet.
3. Créer une base `flash_network`.
4. Copier la **connection string** (`DATABASE_URL` fournie par Neon, au format `postgresql://user:pass@endpoint/neondb?sslmode=require`).
5. Initialiser le schéma :

```bash
psql "DATABASE_URL_NEON" -f src/database/schema.sql
```

> Neon's free tier : 500 MB de stockage, compute serverless (s'endort après inactivité).

### 12.2 Backend — Render

1. Créer un compte sur [render.com](https://render.com).
2. New → Web Service → connecter le repo GitHub.
3. Configuration :
   - **Runtime** : Node
   - **Build command** : `npm install`
   - **Start command** : `node src/app.js`
   - **Root directory** : `./` (racine du repo)
4. Variables d'environnement (Render Dashboard → Environment) :

```env
NODE_ENV=production
TRON_NETWORK=mainnet
DATABASE_URL=<connection string Neon>
JWT_SECRET=<générer avec openssl rand -base64 64>
ENCRYPTION_KEY=<clé AES-256-CBC 32 bytes hex>
PRIVATE_KEY=<clé privée wallet admin TRON mainnet>
TRON_API_KEY=<clé TronGrid>
FLASH_CONTRACT_ADDRESS=<adresse contrat mainnet>
CORS_ORIGIN=https://votre-netlify-app.netlify.app,https://www.votredomaine.com
WORKERS_ENABLED=true
ADMIN_WALLET_ADDRESS=<adresse TRON admin>
```

5. Déployer. Render fournira une URL `https://flash-api-xxxx.onrender.com`.

> ⚠️ Free tier : le service s'endort après 15 min d'inactivité (cold start ~30 sec au premier appel).

### 12.3 TronGrid API key

1. Créer un compte sur [trongrid.io](https://trongrid.io).
2. Générer une API key.
3. La mettre dans `TRON_API_KEY` sur Render.
4. Free tier : limité en requêtes/minute. Pour un MVP test c'est suffisant.

### 12.4 Frontend — Netlify

1. Créer un compte sur [netlify.com](https://netlify.com).
2. Add new site → import from GitHub.
3. Configuration :
   - **Base directory** : `frontend`
   - **Build command** : `npm run build`
   - **Publish directory** : `frontend/dist`
4. Variables d'environnement (si besoin dans `.env.production` ou Netlify UI) :

```env
VITE_API_URL=https://flash-api-xxxx.onrender.com
```

5. Adapter `frontend/vite.config.js` pour la production :

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
```

6. Adapter `frontend/src/lib/api.js` pour utiliser l'URL de l'API en production :

```js
const API_BASE = import.meta.env.VITE_API_URL || "/api";
```

> En dev, `VITE_API_URL` n'est pas définie et les requêtes passent par le proxy Vite `/api`. En prod, `VITE_API_URL` pointe vers Render.

### 12.5 CORS sur Render

Assurez-vous que `CORS_ORIGIN` sur Render contient l'URL Netlify exacte, par exemple :

```env
CORS_ORIGIN=https://flash-network.netlify.app
```

### 12.6 Déploiement du smart contract

1. Prévoir un wallet TRON mainnet avec du TRX.
2. Déployer depuis votre machine locale avec `.env` pointant sur mainnet :

```bash
TRON_NETWORK=mainnet
TRON_API_KEY=<key>
PRIVATE_KEY=<clé>
DATABASE_URL=<Neon connection string>
node scripts/deploy-flash.js
```

3. Mettre à jour `FLASH_CONTRACT_ADDRESS` sur Render.

### 12.7 Commandes de test post-déploiement

```bash
# Health
curl https://flash-api-xxxx.onrender.com/health

# Token info
curl https://flash-api-xxxx.onrender.com/token/info

# Register
curl -X POST https://flash-api-xxxx.onrender.com/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@investor.com","password":"DemoPass123!"}'
```

### 12.8 Limites du gratuit

| Service | Limite | Impact |
|---------|--------|--------|
| **Neon** | 500 MB, compute serverless | Suffisant pour centaines d'utilisateurs. Cold start DB (~1 sec). |
| **Render** | 750 h/mois, s'endort | Cold start API (~30 sec). Pas adapté à fort trafic. |
| **Netlify** | 100 Go bande passante/mois | Très suffisant pour MVP. |
| **TronGrid** | Limites free tier | Passer à Pro si > 1000 req/jour. |

### 12.9 Passage en payant

Quand le MVP valide le modèle :

1. **Neon** → plan Scale ($19/mois) pour performance constante.
2. **Render** → plan Starter ($7/mois) ou migrer vers Fly/Railway.
3. **Netlify** → plan Pro si bande passante dépassée.
4. **TronGrid** → plan Pro ($50-200/mois).

Coût minimal pour un MVP stable : **~30-50 $/mois** + TRX pour le gas.

---

## 13. Architecture de l'URL en production

```textnhttps://flash-network.netlify.app       → Frontend
https://flash-api-xxxx.onrender.com     → API
postgresql://...                          → Neon
```

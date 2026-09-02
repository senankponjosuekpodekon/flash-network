# Flash Network — Pitch Investisseur

## 1. Le problème

Les acteurs en Afrique, en Asie et dans les économies émergentes font face à plusieurs freins :

- **Frais bancaires élevés** sur les transferts transfrontaliers.
- **Temps de règlement longs** (plusieurs jours) pour les virements internationaux.
- **Accès limité aux services financiers** pour les populations non bancarisées.
- **Complexité des cryptomonnaies** : gestion des clés privées, gas fees imprévisibles, UX technique.

Les solutions existantes (Western Union, Wise, stablecoins) réduisent une partie du problème, mais restent chères, lentes ou difficiles d'accès pour un public grand public.

---

## 2. La solution : Flash Network

**Flash Network** est une plateforme de wallet et de transactions basée sur la blockchain **TRON**, avec un token TRC20 personnalisé : **FLASH**.

### Ce qu'elle permet

- **Wallet TRON automatique** pour chaque utilisateur, avec clés privées chiffrées (AES-256-CBC).
- **Transferts internes FLASH instantanés et sans frais de blockchain** (off-chain, finalisés en base de données PostgreSQL).
- **Retraits on-chain** vers n'importe quelle adresse TRON (Trust Wallet, TronLink, Binance…).
- **Dépôts automatiques** détectés par un scanner de transactions TRON.
- **Admin token management** : mint, burn, freeze, blacklist, confiscate, mise à jour des métadonnées.
- **Faucet testnet** pour onboarding sans capital.

### Avantage clé

> Une expérience utilisateur simple et rapide, avec la finalité et la transparence de la blockchain, mais sans les frais et la lenteur des transactions on-chain à chaque opération.

---

## 3. Marché cible

| Segment | Taille indicative | Besoin |
|---------|-------------------|--------|
| Paiements P2P en Afrique/Asie | +$150 Mds/an de remises | Transferts rapides et peu coûteux |
| Fintechs / Néobanques | Marché en croissance 15-20 %/an | Infrastructure blockchain white-label |
| Gaming / Récompenses | Milliards d'utilisateurs | Tokens internes échangeables on-chain |
| Micro-entreprises | TPE/PME non bancarisées | Paiements, trésorerie, facturation |

### Opportunité

Le marché des remises et paiements cross-border reste dominé par des intermédiaires coûteux. Une solution blockchain légère, rapide (TRON finalise en ~3 secondes) et peu coûteuse a une fenêtre d'opportunité claire.

---

## 4. Business model

| Revenu | Mécanisme |
|--------|-----------|
| **Frais de retrait on-chain** | % ou montant fixe sur les retraits vers un wallet externe |
| **Frais de conversion** | FLASH ↔ TRX, FLASH ↔ stablecoin (USDT sur TRON) |
| **Licensing / SaaS** | Déploiement white-label pour fintechs, néobanques, plateformes de récompenses |
| **Services premium** | Limites augmentées, cartes virtuelles, multi-devises |
| **Marge sur le mint/burn** | Commission lors de l'échange entre monnaie fiat et token interne |

### Hypothèse économique

- Coût d'une transaction interne : **~0 $** (off-chain).
- Coût d'une transaction on-chain TRON : **< 0,01 $**.
- Marge possible sur chaque retrait / conversion : **0,5 % à 2 %**.

---

## 5. Démonstration technique

### Architecture

```
┌─────────────┐      REST API (Express)       ┌──────────────┐
│   Frontend  │ ─────────────────────────────▶ │    Backend   │
│ React/Vite  │     JWT + JSON                │  Node.js     │
└─────────────┘                                │  PostgreSQL  │
                                              │  Workers     │
                                              └──────┬───────┘
                                                     │
                              ┌──────────────────────┼──────────────────────┐
                              ▼                      ▼                      ▼
                        TronWeb +            Smart Contract FLASH       External wallets
                        TronGrid API         (TRC20, mint, burn,       (Trust Wallet,
                                               freeze, blacklist)         TronLink)
```

### Cas d'usage démo (disponible maintenant)

1. **Création de compte** en 10 secondes.
2. **Claim 1000 FLASH** via le faucet.
3. **Transfert instantané** 100 FLASH à un autre utilisateur.
4. **Retrait** vers un wallet TRON externe.
5. **Admin panel** pour gérer le token en direct (mint, freeze, etc.).

### Points forts technique

- **Race conditions éliminées** : instances TronWeb par requête.
- **Transactions atomiques** : transferts internes en transaction PostgreSQL.
- **Pagination** : historique scalable.
- **Workers conditionnels** : scanner de dépôts et confirmation on-chain.
- **Tests automatisés** : vitest sur contrat + services.
- **Docker + CI/CD** prêts.

---

## 6. Traction & validation

| Étape | Statut |
|-------|--------|
| Smart contract TRC20 | ✅ Déployé sur Nile testnet |
| Backend API | ✅ 16 endpoints testés |
| Frontend responsive | ✅ Mobile-first, React |
| Transfert interne | ✅ Instantané, atomique |
| Faucet testnet | ✅ Opérationnel |
| Dépôt / retrait on-chain | ✅ Scanning + confirmation automatique |
| Tests unitaires | ✅ 16 tests passent |

---

## 7. Concurrence

| Solution | Forces | Faiblesses vs Flash Network |
|----------|--------|-----------------------------|
| **Wise** | UX simple, fiat-to-fiat | Limité par pays, frais, pas de token propriétaire |
| **Stablecoins (USDT)** | Liquidité, confiance | Volatilité du réseau, gas fees ETH, UX technique |
| **TronLink / Self-custody** | Non custodial | Trop technique pour le grand public |
| **Coinbase / Binance Pay** | Marque, liquidité | KYC lourd, disponibilité géo-limitée |

**Différenciation** : custodial hybride (solde interne off-chain + accès on-chain complet), token FLASH propre, frais minimisés, UX simplifiée.

---

## 8. Besoins & utilisation des fonds

| Utilisation | % cible |
|-------------|---------|
| Développement produit (mainnet, mobile app, multi-devises) | 40 % |
| Sécurité & audits (smart contract, pentest) | 20 % |
| Croissance / marketing / partenariats | 20 % |
| Opérations & conformité (KYC/AML) | 15 % |
| Réserve juridique & inattendus | 5 % |

### Prochaines milestones

1. **Q1** : Audit de sécurité du smart contract, déploiement mainnet TRON.
2. **Q2** : Application mobile (React Native / PWA) et intégration Trust Wallet / TronLink.
3. **Q3** : Intégration USDT-TRC20 et rampes fiat (on-ramp/off-ramp).
4. **Q4** : Partenariats B2B / fintechs pour déploiements white-label.

---

## 9. Équipe

*(À compléter selon le profil réel du porteur de projet)*

- **CEO / Business Development** — vision marché, partenariats.
- **CTO / Lead Dev** — architecture blockchain, backend, sécurité.
- **Blockchain Engineer** — smart contracts, audits, intégrations on-chain.
- **Frontend / Mobile Dev** — UX, application grand public.

---

## 10. Demande

**Objectif** : lever les fonds nécessaires pour passer du testnet au mainnet, auditer le contrat, et lancer la première version grand public.

**Ticket visé** : [à définir selon le stage].

**Livraisons attendues post-investissement** :

- Déploiement mainnet TRON.
- Application PWA/mobile disponible.
- Audit de sécurité externe.
- 1 000 premiers utilisateurs actifs.
- Premiers revenus via frais de retrait/conversion.

---

## 11. Liens & ressources

- **Repository** : `https://github.com/<user>/flash-network` *(à mettre à jour)*
- **Démo locale** :
  - Frontend : `http://localhost:5173`
  - API : `http://localhost:3000`
  - Swagger : `http://localhost:3000/api-docs/ui`
- **Contrat testnet** : `TT2izXuC9kdhuQj1jq6jR6jtL5NEbZvKwu`
- **Document démo** : `DEMO.md`

---

## Résumé pour l'oral (30 secondes)

> Flash Network est une plateforme de wallet et de paiements sur TRON. Elle combine la rapidité et le faible coût des transferts internes off-chain avec la transparence et l'interopérabilité de la blockchain on-chain. Notre token FLASH peut être transféré gratuitement entre utilisateurs, puis retiré à tout moment vers Trust Wallet ou TronLink. Nous ciblons les paiements P2P et les fintechs en Afrique et en Asie. Le produit est déjà fonctionnel sur testnet, avec un smart contract, une API complète, un frontend responsive et des tests automatisés. Nous cherchons un financement pour auditer le contrat, déployer sur mainnet et lancer notre application mobile.

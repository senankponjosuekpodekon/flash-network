import tronWeb from "../config/tron.js";

class WalletService {

    /**
     * Créer un nouveau wallet
     */
    createWallet() {

        return tronWeb.createAccount();

    }

    /**
     * Importer un wallet à partir d'une clé privée
     */
    importWallet(privateKey) {

        const address = tronWeb.address.fromPrivateKey(privateKey);

        return {
            address,
            privateKey
        };

    }

    /**
     * Vérifie qu'une adresse est valide
     */
    validateAddress(address) {

        return tronWeb.isAddress(address);

    }

    /**
     * Récupère toutes les informations du compte
     */
    async getAccount(address) {

        return await tronWeb.trx.getAccount(address);

    }

    /**
     * Solde TRX
     */
    async getBalance(address) {

        const balance = await tronWeb.trx.getBalance(address);

        return balance / 1_000_000;

    }

}

export default new WalletService();
import tronWeb from "../config/tron.js";
import walletRepository from "../repositories/wallet.repository.js";
import { encrypt } from "../utils/crypto.js";


class WalletService {


async createWallet(userId){


    const account =
        await tronWeb.createAccount();


    const encryptedPrivateKey =
        encrypt(account.privateKey);

    const address = account.address.base58;
    const publicKey = account.publicKey;

    await walletRepository.create(
        userId,
        address,
        encryptedPrivateKey,
        publicKey
    );

    // Évite au deposit scanner de requêter toute l'historique TronGrid
    await walletRepository.updateScanTimestamp(
        address,
        Date.now()
    );

    return {
        address,
        publicKey
    };


}


}


export default new WalletService();
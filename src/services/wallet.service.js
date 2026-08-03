import tronWeb from "../config/tron.js";
import walletRepository from "../repositories/wallet.repository.js";
import { encrypt } from "../utils/crypto.js";


class WalletService {


async createWallet(userId){


    const account =
        await tronWeb.createAccount();


    const encryptedPrivateKey =
        encrypt(account.privateKey);


    await walletRepository.create(
        userId,
        account.address.base58,
        encryptedPrivateKey,
        account.publicKey
    );



    return {

        address:
        account.address.base58,


        publicKey:
        account.publicKey

    };


}


}


export default new WalletService();
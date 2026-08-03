import tronWeb from "../config/tron.js";
import transactionRepository from "../repositories/transaction.repository.js";
import walletRepository from "../repositories/wallet.repository.js";
import { decrypt } from "../utils/crypto.js";


class TransactionService {


    async send(userId, to, amount) {

        if (!to || !amount) {
            throw new Error("Destination address and amount required");
        }

        const wallet =
            await walletRepository.findSecureByUserId(userId);

        if (!wallet) {
            throw new Error("Wallet not found");
        }

        const privateKey =
            decrypt(wallet.encrypted_private_key);

        try {
            const transaction =
                await tronWeb.transactionBuilder.sendTrx(
                    to,
                    Number(amount),
                    wallet.address
                );

            const signed =
                await tronWeb.trx.sign(
                    transaction,
                    privateKey
                );

            const broadcast =
                await tronWeb.trx.sendRawTransaction(signed);

            if (!broadcast.result) {
                console.error("TRON broadcast failed for tx:", broadcast.txid);
            }

            const saved =
                await transactionRepository.create({
                    userId,
                    from: wallet.address,
                    to,
                    amount,
                    txid: broadcast.txid,
                    status: broadcast.result ? "PENDING" : "FAILED",
                    type: "TRANSFER",
                    direction: "OUT",
                    block_number: null
                });

            return saved;

        } catch(error) {
            console.error("TRON transaction error:", error.message);

            throw error;
        }

    }





    async history(userId){


        return await transactionRepository.findByUserId(
            userId
        );


    }


}


export default new TransactionService();
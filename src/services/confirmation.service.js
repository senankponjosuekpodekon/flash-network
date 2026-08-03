import tronWeb from "../config/tron.js";

import transactionRepository
from "../repositories/transaction.repository.js";


class ConfirmationService{


    async verify(txid){

        const info =
        await tronWeb.trx.getTransactionInfo(
            txid
        );


        if(!info.blockNumber){

            return null;

        }


        return await transactionRepository.confirm(

            txid,

            info

        );

    }


}


export default new ConfirmationService();
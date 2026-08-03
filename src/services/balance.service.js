import tronWeb from "../config/tron.js";
import walletRepository from "../repositories/wallet.repository.js";


class BalanceService {


async getUserBalance(userId){


    const wallet =
    await walletRepository.findByUserId(userId);


    if(!wallet){

        throw new Error(
            "Wallet not found"
        );

    }



    const balance =
    await tronWeb.trx.getBalance(
        wallet.address
    );


    return {

        address:
        wallet.address,


        balance:
        balance / 1000000,


        unit:"TRX"

    };


}



}


export default new BalanceService();
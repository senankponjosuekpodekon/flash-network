import tronWeb from "../config/tron.js";
import walletRepository from "../repositories/wallet.repository.js";


class FaucetService {

    async claim(userId) {
        const flashContractAddress = process.env.FLASH_CONTRACT_ADDRESS;

        if (!flashContractAddress) {
            throw new Error("FLASH_CONTRACT_ADDRESS missing in .env");
        }

        const wallet = await walletRepository.findByUserId(userId);

        if (!wallet) {
            throw new Error("Wallet not found — create a wallet first");
        }

        const contract = await tronWeb.contract().at(flashContractAddress);

        const balance = await contract.balanceOf(wallet.address).call();
        const currentBalance = BigInt(balance.toString());

        const faucetAmount = BigInt(1000 * 10 ** 18);

        if (currentBalance >= faucetAmount) {
            throw new Error("You already have FLASH tokens — faucet available only for new wallets");
        }

        const txid = await contract.mint(
            wallet.address,
            faucetAmount.toString()
        ).send({
            feeLimit: 100_000_000
        });

        return {
            txid,
            amount: faucetAmount.toString(),
            to: wallet.address,
            message: "1000 FLASH minted to your wallet"
        };
    }

}

export default new FaucetService();

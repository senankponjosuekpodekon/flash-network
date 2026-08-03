import tronWeb from "../config/tron.js";


class AdminService {

    async _getContract() {
        const flashContractAddress = process.env.FLASH_CONTRACT_ADDRESS;

        if (!flashContractAddress) {
            throw new Error("FLASH_CONTRACT_ADDRESS missing in .env");
        }

        return await tronWeb.contract().at(flashContractAddress);
    }

    async mint(toAddress, amount) {
        const contract = await this._getContract();

        const txid = await contract.mint(
            toAddress,
            BigInt(amount).toString()
        ).send({
            feeLimit: 100_000_000
        });

        return { txid, minted: amount, to: toAddress };
    }

    async burn(amount) {
        const contract = await this._getContract();

        const txid = await contract.burn(
            BigInt(amount).toString()
        ).send({
            feeLimit: 100_000_000
        });

        return { txid, burned: amount };
    }

    async freeze(address) {
        const contract = await this._getContract();

        const txid = await contract.freeze(address).send({
            feeLimit: 100_000_000
        });

        return { txid, frozen: address };
    }

    async unfreeze(address) {
        const contract = await this._getContract();

        const txid = await contract.unfreeze(address).send({
            feeLimit: 100_000_000
        });

        return { txid, unfrozen: address };
    }

    async blacklist(address) {
        const contract = await this._getContract();

        const txid = await contract.blacklist(address).send({
            feeLimit: 100_000_000
        });

        return { txid, blacklisted: address };
    }

    async removeBlacklist(address) {
        const contract = await this._getContract();

        const txid = await contract.removeBlacklist(address).send({
            feeLimit: 100_000_000
        });

        return { txid, removed: address };
    }

    async confiscate(address) {
        const contract = await this._getContract();

        const txid = await contract.confiscate(address).send({
            feeLimit: 100_000_000
        });

        return { txid, confiscated: address };
    }

    async tokenInfo() {
        const contract = await this._getContract();

        const name = await contract.name().call();
        const symbol = await contract.symbol().call();
        const decimals = await contract.decimals().call();
        const totalSupply = await contract.totalSupply().call();

        return {
            name: name.toString(),
            symbol: symbol.toString(),
            decimals: Number(decimals),
            totalSupply: totalSupply.toString(),
            contractAddress: process.env.FLASH_CONTRACT_ADDRESS
        };
    }

    async updateMetadata(newName, newSymbol) {
        const contract = await this._getContract();

        const txid = await contract.updateMetadata(
            newName,
            newSymbol
        ).send({
            feeLimit: 100_000_000
        });

        return { txid, newName, newSymbol };
    }

}

export default new AdminService();

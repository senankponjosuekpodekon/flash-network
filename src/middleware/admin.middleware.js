import tronWeb from "../config/tron.js";
import walletRepository from "../repositories/wallet.repository.js";


export default async function adminMiddleware(req, res, next) {
    try {
        const ownerAddress = tronWeb.address.fromPrivateKey(process.env.PRIVATE_KEY);

        const wallet = await walletRepository.findByUserId(req.user.id);

        if (wallet && wallet.address === ownerAddress) {
            return next();
        }

        res.status(403).json({ error: "Admin access required" });
    } catch (error) {
        console.error("Admin middleware error:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

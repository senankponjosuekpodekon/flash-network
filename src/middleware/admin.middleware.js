import tronWeb from "../config/tron.js";


export default function adminMiddleware(req, res, next) {
    const ownerAddress = tronWeb.address.fromPrivateKey(process.env.PRIVATE_KEY);

    if (req.user && req.user.address === ownerAddress) {
        return next();
    }

    res.status(403).json({ error: "Admin access required" });
}

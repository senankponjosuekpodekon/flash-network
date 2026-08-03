import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import faucetService from "../services/faucet.service.js";


const router = express.Router();


router.post(
    "/claim",
    authMiddleware,
    async (req, res) => {
        try {
            const result = await faucetService.claim(req.user.id);
            res.json(result);
        } catch (error) {
            console.error(error);

            if (error.message.includes("Wallet") || error.message.includes("already")) {
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: "Internal server error" });
        }
    }
);


export default router;

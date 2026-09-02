import express from "express";

import walletService from "../services/wallet.service.js";
import authMiddleware from "../middleware/auth.middleware.js";
import walletRepository from "../repositories/wallet.repository.js";
import balanceService from "../services/balance.service.js";


const router = express.Router();


router.post(
    "/create",
    authMiddleware,
    async (req, res) => {
        try {
            const wallet = await walletService.createWallet(
                req.user.id
            );

            res.json(wallet);
        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Internal server error"
            });
        }
    }
);


router.get(
    "/me",
    authMiddleware,
    async (req, res) => {
        try {
            const wallet = await walletRepository.findByUserId(
                req.user.id
            );

            res.json(wallet ?? null);
        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Internal server error"
            });
        }
    }
);


router.get(
    "/balance",
    authMiddleware,
    async (req, res) => {
        try {
            const balance = await balanceService.getUserBalance(
                req.user.id
            );

            res.json(balance);
        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Internal server error"
            });
        }
    }
);


export default router;
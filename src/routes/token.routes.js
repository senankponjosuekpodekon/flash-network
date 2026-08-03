import express from "express";
import { body } from "express-validator";

import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import tokenService from "../services/token.service.js";


const router = express.Router();


router.get(
    "/info",
    async (req, res) => {
        try {
            const info = await tokenService.getInfo();
            res.json(info);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);


router.get(
    "/balance",
    authMiddleware,
    async (req, res) => {
        try {
            const result = await tokenService.getBalance(req.user.id);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);


router.post(
    "/send",
    authMiddleware,
    [
        body("to").notEmpty().withMessage("Destination TRON address required"),
        body("amount").isInt({ gt: 0 }).withMessage("Amount must be a positive integer"),
    ],
    validate,
    async (req, res) => {
        try {
            const result = await tokenService.send(
                req.user.id,
                req.body.to,
                req.body.amount
            );

            res.json(result);
        } catch (error) {
            console.error(error);

            if (error.message.includes("Insufficient") || error.message.includes("Wallet")) {
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: "Internal server error" });
        }
    }
);


export default router;

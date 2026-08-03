import express from "express";
import { body } from "express-validator";

import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import withdrawService from "../services/withdraw.service.js";


const router = express.Router();


router.post(
    "/",
    authMiddleware,
    [
        body("to").notEmpty().withMessage("Destination TRON address required"),
        body("amount").isInt({ gt: 0 }).withMessage("Amount must be a positive integer"),
    ],
    validate,
    async (req, res) => {
        try {
            const result = await withdrawService.withdraw(
                req.user.id,
                req.body.to,
                req.body.amount
            );

            res.json(result);
        } catch (error) {
            console.error(error);

            if (error.message.includes("Insufficient")) {
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: "Internal server error" });
        }
    }
);


export default router;

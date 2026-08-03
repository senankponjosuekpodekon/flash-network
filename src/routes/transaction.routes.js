import express from "express";
import { body } from "express-validator";

import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import transactionService from "../services/transaction.service.js";

const router = express.Router();

router.post(
    "/send",
    authMiddleware,
    [
        body("to").notEmpty().withMessage("Destination address required"),
        body("amount").isFloat({ gt: 0 }).withMessage("Amount must be a positive number"),
    ],
    validate,
    async (req, res) => {
        try {
            const { to, amount } = req.body;

            const result = await transactionService.send(
                req.user.id,
                to,
                amount
            );

            res.json(result);
        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Internal server error"
            });
        }
    }
);


router.get(
    "/history",
    authMiddleware,
    async (req, res) => {
        try {
            const result = await transactionService.history(
                req.user.id
            );

            res.json(result);
        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Internal server error"
            });
        }
    }
);

export default router;
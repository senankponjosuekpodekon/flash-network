import express from "express";
import { body } from "express-validator";

import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import transferService from "../services/transfer.service.js";


const router = express.Router();


router.get(
    "/",
    authMiddleware,
    async (req, res) => {
        try {
            const result = await transferService.getInternalBalance(req.user.id);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);


router.post(
    "/transfer",
    authMiddleware,
    [
        body("to").isEmail().withMessage("Valid recipient email required"),
        body("amount").isInt({ gt: 0 }).withMessage("Amount must be a positive integer"),
    ],
    validate,
    async (req, res) => {
        try {
            const result = await transferService.transfer(
                req.user.id,
                req.body.to,
                req.body.amount
            );
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: error.message });
        }
    }
);


export default router;

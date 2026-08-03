import express from "express";
import { body } from "express-validator";

import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";
import validate from "../middleware/validate.middleware.js";
import adminService from "../services/admin.service.js";


const router = express.Router();


router.get(
    "/token-info",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const info = await adminService.tokenInfo();
            res.json(info);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);


router.post(
    "/mint",
    authMiddleware,
    adminMiddleware,
    [
        body("to").notEmpty().withMessage("Destination address required"),
        body("amount").isInt({ gt: 0 }).withMessage("Amount must be a positive integer"),
    ],
    validate,
    async (req, res) => {
        try {
            const result = await adminService.mint(req.body.to, req.body.amount);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);


router.post(
    "/burn",
    authMiddleware,
    adminMiddleware,
    [
        body("amount").isInt({ gt: 0 }).withMessage("Amount must be a positive integer"),
    ],
    validate,
    async (req, res) => {
        try {
            const result = await adminService.burn(req.body.amount);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);


router.post(
    "/freeze",
    authMiddleware,
    adminMiddleware,
    [
        body("address").notEmpty().withMessage("Address required"),
    ],
    validate,
    async (req, res) => {
        try {
            const result = await adminService.freeze(req.body.address);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);


router.post(
    "/unfreeze",
    authMiddleware,
    adminMiddleware,
    [
        body("address").notEmpty().withMessage("Address required"),
    ],
    validate,
    async (req, res) => {
        try {
            const result = await adminService.unfreeze(req.body.address);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);


router.post(
    "/blacklist",
    authMiddleware,
    adminMiddleware,
    [
        body("address").notEmpty().withMessage("Address required"),
    ],
    validate,
    async (req, res) => {
        try {
            const result = await adminService.blacklist(req.body.address);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);


router.post(
    "/remove-blacklist",
    authMiddleware,
    adminMiddleware,
    [
        body("address").notEmpty().withMessage("Address required"),
    ],
    validate,
    async (req, res) => {
        try {
            const result = await adminService.removeBlacklist(req.body.address);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);


router.post(
    "/confiscate",
    authMiddleware,
    adminMiddleware,
    [
        body("address").notEmpty().withMessage("Address required"),
    ],
    validate,
    async (req, res) => {
        try {
            const result = await adminService.confiscate(req.body.address);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);


router.post(
    "/update-metadata",
    authMiddleware,
    adminMiddleware,
    [
        body("name").notEmpty().withMessage("Token name required"),
        body("symbol").notEmpty().withMessage("Token symbol required"),
    ],
    validate,
    async (req, res) => {
        try {
            const result = await adminService.updateMetadata(req.body.name, req.body.symbol);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);


export default router;

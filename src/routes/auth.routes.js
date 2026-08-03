import express from "express";
import { body } from "express-validator";

import userService from "../services/user.service.js";
import validate from "../middleware/validate.middleware.js";
import authLimiter from "../middleware/authLimiter.middleware.js";


const router = express.Router();


router.post(
    "/register",
    authLimiter,
    [
        body("email").isEmail().withMessage("Valid email required"),
        body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    ],
    validate,
    async (req, res) => {
        try {
            const user = await userService.register(
                req.body.email,
                req.body.password
            );

            res.json(user);
        } catch (error) {
            res.status(400).json({
                error: error.message
            });
        }
    }
);


router.post(
    "/login",
    authLimiter,
    [
        body("email").isEmail().withMessage("Valid email required"),
        body("password").notEmpty().withMessage("Password required"),
    ],
    validate,
    async (req, res) => {
        try {
            const result = await userService.login(
                req.body.email,
                req.body.password
            );

            res.json(result);
        } catch (error) {
            res.status(401).json({
                error: error.message
            });
        }
    }
);


export default router;
import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import userRepository from "../repositories/user.repository.js";


const router = express.Router();


router.get(
    "/me",
    authMiddleware,
    async (req, res) => {
        try {
            const user = await userRepository.findByEmail(
                req.user.email
            );

            if (!user) {
                return res.status(404).json({
                    error: "User not found"
                });
            }

            res.json({
                id: user.id,
                email: user.email,
                created_at: user.created_at
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Internal server error"
            });
        }
    }
);


export default router;
import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { createAccountController } from "../controllers/account.controllers.js";

const router = express.Router();

/**
 * @POST /api/accounts
 * @desc Create a new account for the authenticated user
 * protected route
 */

router.post("/createAccount", authMiddleware, createAccountController);

export default router;
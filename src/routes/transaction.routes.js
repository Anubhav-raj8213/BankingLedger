import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { createTransactionController, getTransactionsController } from "../controllers/transaction.controllers.js";

const router = express.Router();

/**
 * @POST /api/transactions
 * @desc Create a new transaction for the authenticated user
 * protected route
 */

router.post("/createTransaction", authMiddleware, createTransactionController);

/**
 * @GET /api/transactions
 * @desc Get all transactions for the authenticated user
 * protected route
 */


export default router;
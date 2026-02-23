import express from 'express';
import dotenv from 'dotenv';
import { authRoutes, accountRoutes, transactionRoutes } from "./routes/index.js";
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);

export default app;
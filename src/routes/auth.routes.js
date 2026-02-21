import express from 'express';

import { reggisterUser, loginUser } from '../controllers/auth.controllers.js';

const router = express.Router();

router.post("/register", reggisterUser);

router.post("/login", loginUser);


export default router;
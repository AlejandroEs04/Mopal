import express from 'express';
import { auth, getAuth } from '../controllers/AuthController.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.route('/').get(checkAuth, getAuth).post(auth);

export default router;
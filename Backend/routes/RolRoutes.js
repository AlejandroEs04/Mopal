import express from 'express'
import checkAuth from '../middleware/checkAuth.js';
import { getAllRol } from '../controllers/RolController.js';

const router = express.Router();

router.get('/', checkAuth, getAllRol);

export default router
import express from 'express';
import { getAllSpecifications } from '../controllers/Specification.js';

const router = express.Router();

router.route('/').get(getAllSpecifications);

export default router;
import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
import { addNewSupplier, getAllSupplier, updateSupplier } from '../controllers/SupplierController.js';

const router = express.Router();

router.route('/').get(checkAuth, getAllSupplier).post(checkAuth, addNewSupplier).put(checkAuth, updateSupplier);

export default router
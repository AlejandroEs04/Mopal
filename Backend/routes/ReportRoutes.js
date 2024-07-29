import express from 'express'
import { getProductsSaleTotal } from '../controllers/InventoryReportController.js';

const router = express.Router();

router.get('/products_total', getProductsSaleTotal)
router.get('/products_total/:month/:year', getProductsSaleTotal)

export default router
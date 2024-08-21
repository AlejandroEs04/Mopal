import express from 'express'
import { getInventoryMovement, getProductsSaleTotal, getSaleReport } from '../controllers/InventoryReportController.js';

const router = express.Router();

router.get('/products_total', getProductsSaleTotal)
router.get('/products_total/:month/:year', getProductsSaleTotal)
router.get('/inventory-movement', getInventoryMovement)
router.post('/sale-report', getSaleReport)

export default router
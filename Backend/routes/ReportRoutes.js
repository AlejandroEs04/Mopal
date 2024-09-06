import express from 'express'
import { getInventoryMovement, getProductsSaleTotal, getPurchaseReport, getSaleReport } from '../controllers/InventoryReportController.js';

const router = express.Router();

router.get('/products_total', getProductsSaleTotal)
router.get('/products_total/:month/:year', getProductsSaleTotal)
router.get('/inventory-movement', getInventoryMovement)
router.post('/sale-report', getSaleReport)
router.post('/purchase-report', getPurchaseReport)

export default router
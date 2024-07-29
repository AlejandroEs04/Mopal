import express from 'express'
import checkAuth from '../middleware/checkAuth.js';
import { addNewSale, toggleSale, getAllSales, updateSale, deleteSaleProduct, deleteSale, changeStatus } from '../controllers/SaleController.js';

const router = express.Router();

router.route('/').get(checkAuth, getAllSales).post(checkAuth, addNewSale).put(checkAuth, updateSale)
router.route('/:folio').post(checkAuth, toggleSale).delete(checkAuth, deleteSale)
router.route('/:saleId/:productId').delete(checkAuth, deleteSaleProduct);
router.put('/status/:id', checkAuth, changeStatus);

export default router
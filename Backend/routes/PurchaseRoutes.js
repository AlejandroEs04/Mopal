import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
import { addNewPurchase, changeStatus, deletePurchase, deletePurchaseProduct, getAllPurchase, updatePurchase } from '../controllers/PurchaseController.js';

const router = express.Router();

router.route('/').get(checkAuth, getAllPurchase).post(checkAuth, addNewPurchase).put(checkAuth, updatePurchase);
router.route('/:id').delete(checkAuth, deletePurchase)
router.route('/:purchaseId/:productId').delete(checkAuth, deletePurchaseProduct);
router.route('/status/:id').put(checkAuth, changeStatus)

export default router;
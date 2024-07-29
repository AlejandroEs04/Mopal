import express from 'express'
import checkAuth from '../middleware/checkAuth.js';
import { addCustomerDiscount, addDiscount, getDiscounts, removeCustomerDiscount, removeDiscount, supplierProductDiscount, updateDiscount } from '../controllers/DiscountController.js';

const router = express.Router();

router.route('/').get(checkAuth, getDiscounts).post(checkAuth, addDiscount);
router.route('/supplier').post(checkAuth, supplierProductDiscount)
router.route('/supplier/:id').delete(checkAuth, removeDiscount).put(checkAuth, updateDiscount);
router.route('/customer').post(checkAuth, addCustomerDiscount)
router.route('/customer/:id').delete(checkAuth, removeCustomerDiscount)

export default router
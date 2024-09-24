import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
import { addNewCustomer, getAllCustomers, updateCustomer } from '../controllers/CustomerController.js';

const router = express.Router()

router.route('/').get(checkAuth, getAllCustomers).post(checkAuth, addNewCustomer).put(checkAuth, updateCustomer)

export default router;
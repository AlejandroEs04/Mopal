import express from 'express'
import checkAuth from '../middleware/checkAuth.js';
import { addProductList, addProductListInfo, getAllProductList } from '../controllers/ProductListController.js';

const router = express.Router();

router.route('/').get(getAllProductList).post(checkAuth, addProductList)
router.route('/info').post(checkAuth, addProductListInfo)

export default router
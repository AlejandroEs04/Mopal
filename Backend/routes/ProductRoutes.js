import express from 'express'
import { activateProduct, addNewProduct, addProductAccesory, addProductInfo, deleteProduct, deleteProductAccesory, getAllProduct, updateProduct } from '../controllers/ProductController.js';
import checkAuth from '../middleware/checkAuth.js';
import { checkProductActionsPermision } from '../middleware/checkPermision.js';

const router = express.Router()

router.route('/')
    .get(getAllProduct)
    .post(checkAuth, checkProductActionsPermision, addNewProduct)
    .put(checkAuth, checkProductActionsPermision, updateProduct);

router.route('/:folio')
    .delete(checkAuth, checkProductActionsPermision, deleteProduct);

router.route('/:folio/accesories')
    .post(checkAuth, checkProductActionsPermision, addProductAccesory);

router.route('/:folio/accesories/:accesoryFolio')
    .delete(checkAuth, checkProductActionsPermision, deleteProductAccesory);

router.get('/activate/:folio', checkAuth, checkProductActionsPermision, activateProduct);

router.route('/info')
    .post(checkAuth, checkProductActionsPermision, addProductInfo);

export default router;
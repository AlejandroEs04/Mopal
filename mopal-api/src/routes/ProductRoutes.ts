import { Router } from "express"
import { ProductController } from "../controllers/ProductContoller"

const router = Router()

router.get('/', ProductController.getAllProduct)
router.post('/', ProductController.createProduct)
router.put('/:id', ProductController.updateProduct)

export default router
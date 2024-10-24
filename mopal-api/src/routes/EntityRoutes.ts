import { Router } from "express"
import { EntityController } from "../controllers/EntityController"

const router = Router()

router.get('/', EntityController.getAllEntites)
router.post('/', EntityController.createEntity)
router.put('/:id', EntityController.updateEntity)
router.delete('/:id', EntityController.deleteEntity)

router.post('/:entityId/discount', EntityController.addEntityDiscount)
router.delete('/:entityId/discount/:discountId', EntityController.deleteEntityDiscount)

router.post('/:entityId/user', EntityController.addEntityUser)
router.delete('/:entityId/user/:userId', EntityController.deleteEntityUser)

export default router
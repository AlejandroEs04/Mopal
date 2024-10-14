import express from 'express'
import checkAuth from '../middleware/checkAuth.js'
import { approveRequest, getAllPendingRequest, rejectRequest } from '../controllers/PendingRequestController.js'

const router = express.Router()

router.get('/', checkAuth, getAllPendingRequest)
router.get('/:id/approve-request', checkAuth, approveRequest)
router.get('/:id/reject-request', checkAuth, rejectRequest)

export default router
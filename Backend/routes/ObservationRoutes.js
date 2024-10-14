import express from 'express'
import checkAuth from '../middleware/checkAuth.js'
import { createObservation, deleteObservation, getAll, updateObservation } from '../controllers/ObservationController.js'

const router = express.Router()

router.get('/', checkAuth, getAll)
router.post('/', checkAuth, createObservation)
router.put('/', checkAuth, updateObservation)
router.delete('/:id', checkAuth, deleteObservation)

export default router
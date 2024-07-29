import express from 'express';
import { addNewType, getAllTypes, getOneType, updateType } from '../controllers/TypeController.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.route('/').get(getAllTypes).post(checkAuth, addNewType).put(checkAuth, updateType);
router.route('/:id').get(getOneType);

export default router
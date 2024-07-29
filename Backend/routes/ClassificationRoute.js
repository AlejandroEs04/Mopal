import express from 'express';
import { addNewClassification, getAllClassification, getOneClassification, updateClassification } from '../controllers/ClassificationController.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.route('/').get(getAllClassification).post(checkAuth, addNewClassification);
router.route('/:id').get(getOneClassification).put(checkAuth, updateClassification);

export default router;
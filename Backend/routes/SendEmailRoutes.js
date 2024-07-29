import express from 'express'
import multer from 'multer';
import { sendEmailQuotation } from '../controllers/SendEmailController.js';

const router = express.Router();
const upload = multer();

router.post('/quotation/:id', upload.single('pdf'), sendEmailQuotation);

export default router
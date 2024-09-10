import express from 'express'
import multer from 'multer';
import { sendEmailQuotation, sendEmailRequestQuotation } from '../controllers/SendEmailController.js';

const router = express.Router();
const upload = multer();

router.post('/quotation/:id', upload.single('pdf'), sendEmailQuotation);
router.post('/request/quotation/:id', upload.single('pdf'), sendEmailRequestQuotation);

export default router
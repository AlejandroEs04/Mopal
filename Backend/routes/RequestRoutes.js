import express from 'express'
import multer from 'multer';
import checkAuth from '../middleware/checkAuth.js';
import { acceptRequest, addNewRequest, cancelRequest, getAllRequest, getOneRequest, getUserRequest, toggleStatus } from '../controllers/RequestController.js';

const router = express.Router();
const upload = multer();

router.route('/')
    .get(checkAuth, getAllRequest)
    .post(checkAuth, addNewRequest);
router.route('/:id')
    .post(checkAuth, toggleStatus)
    .get(checkAuth, getOneRequest)
    .put(checkAuth, acceptRequest)
    .delete(checkAuth, cancelRequest);
router.get('/user/requests', checkAuth, getUserRequest);
router.put('/status/:id', checkAuth, toggleStatus)

    
// router.route('/status/:id').put(checkAuth, changeStatus)
export default router;
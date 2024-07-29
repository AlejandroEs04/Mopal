import express from 'express';
import { addNewUser, deleteUser, getAllUsers, getOneUser, recoveryUser, updateUser } from '../controllers/UserController.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.route('/').get(checkAuth, getAllUsers).post(checkAuth, addNewUser).put(checkAuth, updateUser);
router.route('/:id').get(checkAuth, getOneUser).delete(checkAuth, deleteUser);
router.route('/recovery/:id').get(checkAuth, recoveryUser)

export default router;
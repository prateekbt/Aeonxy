import express from 'express';
import UserController from '../controllers/user.Controller.js';
const {
    addUser,
    confirmToken,
    getUser,
    updateUser,
    deleteUser} = UserController;


const router = express.Router();

router.get('/',getUser);

router.post('/',addUser);

router.get('/:confirmationToken',confirmToken);

router.put('/:id',updateUser);

router.get('/:id',deleteUser);

export default router; 

import express from 'express';
import { register, authenticate } from '../controllers/userController.js';

const router = express.Router();

//Authentication, Register and Confirm User
router.post('/', register); //Create a new user
router.post('/login', authenticate) //Login a user

export default router;
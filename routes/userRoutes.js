import express from 'express';
import { register } from '../controllers/userController.js';

const router = express.Router();

//Authentication, Register and Confirm User
router.post('/', register); //Create a new user

export default router;
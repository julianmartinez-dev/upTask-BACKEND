import express from 'express';
import {
  register,
  authenticate,
  confirm,
  forgotPassword,
  checkToken,
  newPassword
} from '../controllers/userController.js';

const router = express.Router();

//Authentication, Register and Confirm User
router.post('/', register); //Create a new user
router.post('/login', authenticate) //Login a user
router.get('/confirm/:token', confirm) //Confirm a user
router.post('/forgot-password', forgotPassword) //Forgot password
router.get('/forgot-password/:token',checkToken) //Check if token is valid
router.post('/forgot-password/:token', newPassword) //Generate new password

export default router;
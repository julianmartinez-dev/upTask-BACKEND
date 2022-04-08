import { application } from 'express';
import User from '../models/User.js';
import generateID from '../helpers/generateID.js';
import generateJWT from '../helpers/generateJWT.js';

const register = async (req, res) => {
  //Check if user already exists
  const { email } = req.body;
  const isRegistered = await User.findOne({ email });

  if (isRegistered) {
    const error = new Error('User already exists');
    return res.status(400).json({ msg: error.message });
  }

  try {
    const user = new User(req.body);
    user.token = generateID();
    const storedUser = await user.save();
    res.json(storedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};

const authenticate = async (req, res) => {
  const { email, password } = req.body;
  //Check if user already exists
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error('User does not exist');
    return res.status(404).json({ msg: error.message });
  }
  //Check if user is confirmed
  if (!user.confirmed) {
    const error = new Error('User is not confirmed');
    return res.status(403).json({ msg: error.message });
  }

  //Check if password is correct
  if (await user.comparePassword(password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateJWT(user._id),
    });
  } else {
    const error = new Error('Password is incorrect');
    return res.status(403).json({ msg: error.message });
  }
};

//Confirm a user via json web token
const confirm = async (req, res) => {
  const { token } = req.params;
  const confirmUser = await User.findOne({ token });

  if (!confirmUser) {
    const error = new Error('Token is invalid');
    return res.status(404).json({ msg: error.message });
  }

  try {
    confirmUser.confirmed = true;
    confirmUser.token = '';
    //Save the user
    await confirmUser.save();
    res.json({ msg: 'User confirmed' });
  } catch (error) {
    console.log(error);
  }
};

//Forgot password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error('User does not exist');
    return res.status(404).json({ msg: error.message });
  }

  try {
    user.token = generateJWT(user._id);
    await user.save();
    res.json({ msg: 'Email with instructions sended' });
  } catch (error) {
    console.log(error);
  }
};

//Check if token is valid
const checkToken = async (req, res) => {
  const { token } = req.params;

  const validToken = await User.findOne({ token });
  if (validToken) {
    res.json({ msg: 'Token is valid' });
  } else {
    const error = new Error('Token is invalid');
    return res.status(404).json({ msg: error.message });
  }
};

//Generate new password
const newPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ token });
  if(user){
    user.password = password;
    user.token = '';
   try {
      await user.save();
      res.json({ msg: 'Password changed' });
   } catch (error) {
     console.log(error)
   }
  }else{
    const error = new Error('Token is invalid');
    return res.status(404).json({ msg: error.message });
  }
};

const profile = async (req, res) => {
  const { user } = req
  res.json(user)
}
export {
  register,
  authenticate,
  confirm,
  forgotPassword,
  checkToken,
  newPassword,
  profile
};

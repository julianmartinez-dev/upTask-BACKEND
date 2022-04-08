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
  if(await user.comparePassword(password)){
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateJWT(user._id),

    })
  }else{
   const error = new Error('Password is incorrect');
   return res.status(403).json({ msg: error.message });
  }
};

export { register, authenticate };

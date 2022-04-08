import { application } from 'express';
import User from '../models/User.js';

const register = async (req, res) => {
  //Check if user already exists
  const { email } = req.body;
  const isRegistered = await User.findOne({ email });

  if(isRegistered) {
      const error = new Error('User already exists');
      return res.status(400).json({error: error.message});
  }

  try {
    const user = new User(req.body);
    const storedUser = await user.save();
    res.json(storedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export { register };

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();
//Enable json reading from request body
app.use(express.json());
//Enable dontenv to read .env file
dotenv.config();
//Connect to MongoDB
connectDB();

//Enable CORS
const whiteList = ['http://localhost:3000', 'https://localhost:3443'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.includes(origin)) {
      //If origin is in the whitelist, allow it
      callback(null, true);
    } else {
      //If origin is not in the whitelist, reject it
      callback(new Error('Not allowed by CORS'));
    }
  },
};
app.use(cors(corsOptions));

//Routing
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

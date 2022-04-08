import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
//Enable json reading from request body
app.use(express.json());
//Enable dontenv to read .env file
dotenv.config()
//Connect to MongoDB
connectDB()

//Routing
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

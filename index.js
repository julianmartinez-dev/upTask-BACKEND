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
const whiteList = [process.env.FRONTEND_URL];
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

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//Socket.io
import { Server } from 'socket.io'

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

io.on('connection', (socket) => {
  console.log('New client connected');
  
  //Define socket events
  socket.on('open project', (id) =>{
    socket.join(id);
    socket.emit('response', 'Project opened');
  })

  //New task
  socket.on('newTask', (task) =>{
    socket.to(task.project).emit('taskAdded', task);
  })
  
  //Delete task
  socket.on('deleteTask', (task) => {
    const project = task.project;
    socket.to(project).emit('taskDeleted', task);
  });

  socket.on('editTask', (task) => {
    const project = task.project._id;
    socket.to(project).emit('taskEdited', task);
  });

  socket.on('completeTask', task =>{
    const project = task.project._id;
    socket.to(project).emit('taskCompleted', task);
  })


})
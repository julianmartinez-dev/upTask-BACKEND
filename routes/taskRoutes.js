import express from 'express';
import checkAuth from '../middleware/checkAuth.js';

import {
    addTask,
    getTask,
    updateTask,
    deleteTask,
    updateStatus
} from '../controllers/taskController.js';

const router = express.Router();

router.post('/',checkAuth,  addTask);
router.route('/:id')
    .get(checkAuth, getTask)
    .put(checkAuth, updateTask)
    .delete(checkAuth, deleteTask)

router.post('status/:id',checkAuth, updateStatus);


export default router;
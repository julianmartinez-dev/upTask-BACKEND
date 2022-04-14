import express from 'express';

import {
  getProjects,
  getProject,
  newProject,
  editProject,
  deleteProject,
  searchMember,
  addMember,
  deleteMember,
} from '../controllers/projectsController.js';

import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.route('/')
    .get(checkAuth,getProjects)
    .post(checkAuth,newProject);

router.route('/:id')
    .get(checkAuth, getProject)
    .put(checkAuth, editProject)
    .delete(checkAuth, deleteProject);

router.post('/members', checkAuth, searchMember);
router.post('/members/:id', checkAuth, addMember);
router.post('/delete-members/:id', checkAuth, deleteMember);

export default router;
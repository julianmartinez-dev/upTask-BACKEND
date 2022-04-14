import mongoose from 'mongoose';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import User from '../models/User.js';

//Get all projects
const getProjects = async (req, res) => {
  const projects = await Project.find({
    $or: [{ members: { $in: req.user } }, { creator: { $in: req.user } }],
  }).select('-tasks');
  res.json(projects);
};

//Get one project
const getProject = async (req, res) => {
  const { id } = req.params;
  if (id.length !== 24) {
    const error = new Error('Invalid id');
    return res.status(404).json({ msg: error.message });
  }
  const project = await Project.findById(id)
    .populate('tasks')
    .populate('members', 'name email');
  if (!project) {
    const error = new Error('Project not found');
    return res.status(404).json({ msg: error.message });
  }

  if (
    project.creator.toString() !== req.user._id.toString() &&
    !project.members.some(
      (member) => member._id.toString() === req.user._id.toString()
    )
  ) {
    return res.status(401).json({ msg: 'Not authorized' });
  }

  res.json(project);
};

//Create a new project
const newProject = async (req, res) => {
  const project = new Project(req.body);
  project.creator = req.user._id;
  try {
    const storedProject = await project.save();
    res.json(storedProject);
  } catch (error) {
    console.log(error);
  }
};

//Edit a project
const editProject = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) {
    const error = new Error('Project not found');
    return res.status(404).json({ msg: error.message });
  }

  if (project.creator.toString() !== req.user._id.toString()) {
    return res.status(401).json({ msg: 'Not authorized' });
  }

  //Edit project with new data
  project.name = req.body.name || project.name;
  project.description = req.body.description || project.description;
  project.client = req.body.client || project.client;
  project.deliveryDate = req.body.deliveryDate || project.deliveryDate;

  try {
    const storedProject = await project.save();
    res.json(storedProject);
  } catch (error) {
    console.log(error);
  }
};
//Delete a project
const deleteProject = async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) {
    const error = new Error('Project not found');
    return res.status(404).json({ msg: error.message });
  }

  if (project.creator.toString() !== req.user._id.toString()) {
    return res.status(401).json({ msg: 'Not authorized' });
  }

  try {
    await project.deleteOne();
    res.json({ msg: 'Project removed' });
  } catch (error) {
    console.log(error);
  }
};
//Search collaborator
const searchMember = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).select(
    '-confirmed -password -__v -createdAt -updatedAt -token'
  );

  if (!user) {
    const error = new Error('User not found');
    return res.status(404).json({ msg: error.message });
  }

  res.json(user);
};
//Add collaborator to project
const addMember = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    const error = new Error('Project not found');
    return res.status(404).json({ msg: error.message });
  }

  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error('Not authorized');
    return res.status(401).json({ msg: error.message });
  }

  const { email } = req.body;
  const user = await User.findOne({ email }).select(
    '-confirmed -password -__v -createdAt -updatedAt -token'
  );

  if (!user) {
    const error = new Error('User not found');
    return res.status(404).json({ msg: error.message });
  }

  // Collaborator is not the creator
  if (project.creator.toString() === user._id.toString()) {
    const error = new Error('You cannot add yourself');
    return res.status(400).json({ msg: error.message });
  }

  //Check if not already collaborator
  if (project.members.includes(user._id)) {
    const error = new Error('User is already collaborator');
    return res.status(400).json({ msg: error.message });
  }

  //Add collaborator to project

  project.members.push(user._id);
  project.save();
  res.json({ msg: 'Collaborator added' });
};
//Delete collaborator from project
const deleteMember = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    const error = new Error('Project not found');
    return res.status(404).json({ msg: error.message });
  }

  //Delete collaborator from project
  project.members.pull(req.body.id);
  await project.save();
  res.json({ msg: 'Collaborator removed' });
};

export {
  getProjects,
  getProject,
  newProject,
  editProject,
  deleteProject,
  addMember,
  deleteMember,
  searchMember,
};

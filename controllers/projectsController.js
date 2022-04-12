import Project from '../models/Project.js';
import Task from '../models/Task.js';

//Get all projects
const getProjects = async  (req, res) => {
    const projects = await Project.find().where('creator').equals(req.user);
    res.json(projects)
};

//Get one project
const getProject = async (req, res) => {
    const { id } = req.params;
    const project = await Project.findById(id).populate('tasks')
    if(!project){
        const error = new Error('Project not found');
        return res.status(404).json({msg: error.message});
    }

    if(project.creator.toString() !== req.user._id.toString()){
        return res.status(401).json({msg: 'Not authorized'});
    }

    //Get tasks for project
    //const tasks = await Task.find().where('project').equals(project._id)
    //res.json({project, tasks});

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
    if(!project){
        const error = new Error('Project not found');
        return res.status(404).json({msg: error.message});
    }

    if(project.creator.toString() !== req.user._id.toString()){
        return res.status(401).json({msg: 'Not authorized'});
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
        console.log(error)
    }
};
//Delete a project
const deleteProject = async (req, res) => {
    const { id } = req.params;
    const project = await Project.findById(id);
    if(!project){
        const error = new Error('Project not found');
        return res.status(404).json({msg: error.message});
    }

    if(project.creator.toString() !== req.user._id.toString()){
        return res.status(401).json({msg: 'Not authorized'});
    }

    try {
        await project.deleteOne()
        res.json({msg: 'Project removed'});
    } catch (error) {
        console.log(error)
    }
};
//Add member to project
const addMember = (req, res) => {};
//Delete member from project
const deleteMember = (req, res) => {};


export {
  getProjects,
  getProject,
  newProject,
  editProject,
  deleteProject,
  addMember,
  deleteMember,
};

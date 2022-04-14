import Project from '../models/Project.js'
import Task from '../models/Task.js'

const addTask = async (req, res) => {
    const { project } = req.body

    // Check if project exists
    const isProject = await Project.findById(project)
    if (!isProject) {
        const error = new Error('Project not found')
        return res.status(404).json({ msg: error.message})
    }
    //Check if the creator of the project is the same as the user
    if(isProject.creator.toString() !== req.user._id.toString()) {
        const error = new Error('Not authorized to add tasks to this project')
        return res.status(401).json({ msg: error.message})
    }

    // Create task
    try {
        const storedTask = await Task.create(req.body)
        //Add task to project
        isProject.tasks.push(storedTask._id)
        await isProject.save()
        res.json(storedTask)
    } catch (error) {
        console.log(error)
    }

}

const getTask = async (req, res) => {
    const { id } = req.params
    
    const task = await Task.findById(id).populate('project')
    //Check if task exists
    if (!task) {
        const error = new Error('Task not found')
        return res.status(404).json({ msg: error.message})
    }
    //Check if task creator is the same as the user
    if(task.project.creator.toString() !== req.user._id.toString()) {
        const error = new Error('Not authorized to view this task')
        return res.status(403).json({ msg: error.message})
    }

    //Return task
    res.json(task)
}

const updateTask = async (req, res) => {
    const { id } = req.params;

    const task = await Task.findById(id).populate('project');
    //Check if task exists
    if (!task) {
      const error = new Error('Task not found');
      return res.status(404).json({ msg: error.message });
    }
    //Check if task creator is the same as the user
    if (task.project.creator.toString() !== req.user._id.toString()) {
      const error = new Error('Not authorized to view this task');
      return res.status(403).json({ msg: error.message });
    }

    //Update task
    task.name = req.body.name || task.name;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.status = req.body.status || task.status;
    task.deliveryDate = req.body.deliveryDate || task.deliveryDate;

    try {
        const storedTask = await task.save();
        res.json(storedTask);
    } catch (error) {
        console.log(error)
    }
}

const deleteTask = async (req, res) => {
    const { id } = req.params;
    const task = await Task.findById(id).populate('project');
    //Check if task exists
    if (!task) {
        const error = new Error('Task not found');
        return res.status(404).json({ msg: error.message });
    }
    //Check if task creator is the same as the user
    if(task.project.creator.toString() !== req.user._id.toString()){
        const error = new Error('Not authorized to delete this task');
        return res.status(403).json({ msg: error.message });
    }
    //Try to delete task
    try {
        const project = await Project.findById(task.project)
        project.tasks.pull(task._id)

        await Promise.allSettled([
          await project.save(),
          await task.deleteOne(),
        ]);
        
        res.json({ msg: 'Task deleted' });
    } catch (error) {
        console.log(error)
    }
}

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id).populate('project');
  //Check if task exists
  if (!task) {
    const error = new Error('Task not found');
    return res.status(404).json({ msg: error.message });
  }
  //Check if task creator is the same as the user
  if (task.project.creator.toString() !== req.user._id.toString()  &&
    !task.members.some(
      (member) => member._id.toString() === req.user._id.toString()
    )){
    const error = new Error('Not authorized to delete this task');
    return res.status(403).json({ msg: error.message });
  }

    //Update task
    task.status = !task.status;
    await task.save();
    res.json(task);
}

export {
    addTask,
    getTask,
    updateTask,
    deleteTask,
    updateStatus
}
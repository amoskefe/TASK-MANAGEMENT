const Task = require('../models/Task');

// Create a Task
exports.createTask = async (req, res) => {
  const { title, description, dueDate, category } = req.body;
  try {
    const task = new Task({
      title,
      description,
      dueDate,
      category,
      userId: req.user.id
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Task creation failed' });
  }
};

// Get all Tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

// Get Task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task' });
  }
};

// Update a Task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Task update failed' });
  }
};

// Delete a Task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Task deletion failed' });
  }
};

// Mark a Task as complete/incomplete
exports.updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { completed: req.body.completed },
      { new: true }
    );
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task status' });
  }
};

// Filter Tasks by Category
exports.getTasksByCategory = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id, category: req.params.category });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks by category' });
  }
};

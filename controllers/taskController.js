const Task = require('../models/Task');
const User = require('../models/User');
const Activity = require('../Models/Activity');
const Notification = require('../Models/Notification'); // Corrected casing

// Create a Task
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, tags, dependencies } = req.body;
    const newTask = new Task({
      title,
      description,
      status,
      priority,
      dueDate,
      tags,
      dependencies,
      user: req.user.id,
      file: req.file.path // Save file path
    });
    const task = await newTask.save();

    // Log activity
    const activity = new Activity({
      user: req.user.id,
      action: 'created task',
      task: task._id
    });
    await activity.save();

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get paginated tasks
exports.getTasksPaginated = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Task.countDocuments({ user: req.user.id });
    const tasks = await Task.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex);

    res.json({
      tasks,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalTasks: total
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get a single task
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, tags, dependencies } = req.body;
    const taskFields = { title, description, status, priority, dueDate, tags, dependencies, updatedAt: Date.now() };
    let task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: taskFields },
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Log activity
    const activity = new Activity({
      user: req.user.id,
      action: 'updated task',
      task: task._id
    });
    await activity.save();

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Log activity
    const activity = new Activity({
      user: req.user.id,
      action: 'deleted task',
      task: task._id
    });
    await activity.save();

    res.json({ message: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get tasks by status
exports.getTasksByStatus = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id, status: req.params.status }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get tasks by priority
exports.getTasksByPriority = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id, priority: req.params.priority }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Search tasks
exports.searchTasks = async (req, res) => {
  try {
    const { query } = req.query;
    const tasks = await Task.find(
      { 
        $and: [
          { user: req.user.id },
          { $text: { $search: query } }
        ]
      },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Assign task to users
exports.assignTask = async (req, res) => {
  try {
    const { assigneeIds } = req.body;
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify all assignees exist
    const assignees = await User.find({ _id: { $in: assigneeIds } });
    if (assignees.length !== assigneeIds.length) {
      return res.status(400).json({ message: 'One or more assignees not found' });
    }

    task.assignees = assigneeIds;
    await task.save();

    // Send notifications
    for (const assigneeId of assigneeIds) {
      const notification = new Notification({
        user: assigneeId,
        message: `You have been assigned to task: ${task.title}`
      });
      await notification.save();
    }

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get tasks assigned to the current user
exports.getAssignedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignees: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
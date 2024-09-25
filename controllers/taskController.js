const Task = require('../models/taskModel');

// Create Task
exports.createTask = async (req, res) => {
    const { title, description, deadline, category } = req.body;
    try {
        const task = new Task({ user: req.userId, title, description, deadline, category });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Task creation failed' });
    }
};

// Get All Tasks
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.userId });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Fetching tasks failed' });
    }
};

// Get Task by ID
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.userId });
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Fetching task failed' });
    }
};

// Update Task
exports.updateTask = async (req, res) => {
    const { title, description, status, deadline, category } = req.body;
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            { title, description, status, deadline, category },
            { new: true }
        );
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Updating task failed' });
    }
};

// Delete Task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Deleting task failed' });
    }
};

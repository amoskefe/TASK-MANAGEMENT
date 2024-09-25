// routes/task.js
const express = require('express');
const Task = require('../models/task.js');
const authMiddleware = require('../middleware/auth.js');
const router = express.Router();

// Create a new task
router.post('/', authMiddleware, async (req, res) => {
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
  });
  
// Get all tasks for a user
router.get('/', authMiddleware, async (req, res) => {
    try {
      const tasks = await Task.find({ userId: req.user.id });
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tasks' });
    }
  });
  
  // Fetch task by ID
  router.get('/:id', authMiddleware, async (req, res) => {
    try {
      const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
      if (!task) return res.status(404).json({ message: 'Task not found' });
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching task' });
    }
  });
  
// Update a task
router.put('/:id', authMiddleware, async (req, res) => {
    try {
      const updatedTask = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        req.body,
        { new: true }
      );
      if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: 'Task update failed' });
    }
  });

// Delete a task
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
      const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
      if (!deletedTask) return res.status(404).json({ message: 'Task not found' });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Task deletion failed' });
    }
  });
  
//   Task Status
router.put('/:id/status', authMiddleware, async (req, res) => {
    try {
      const task = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { completed: req.body.completed },
        { new: true }
      );
      if (!task) return res.status(404).json({ message: 'Task not found' });
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: 'Error updating task status' });
    }
  });
  
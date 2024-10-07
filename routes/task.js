const express = require('express');
const Task = require('../Models/Task.js');
const authMiddleware = require('../middleware/auth.js');
const roleMiddleware = require('../middleware/role.js');
const router = express.Router();
const { validateTask, validateAssignment } = require('../middleware/taskValidation');
const { searchLimiter } = require('../middleware/rateLimiter');
const upload = require('../middleware/upload');
const { 
  getTasks, 
  getTask,
  createTask, 
  updateTask,
  deleteTask,
  getTasksByStatus,
  getTasksByPriority,
  searchTasks,
  getTasksPaginated,
  assignTask,
  getAssignedTasks
} = require('../controllers/taskController');

// Get all tasks
router.get('/', authMiddleware, getTasks);

// Get paginated tasks
router.get('/paginated', authMiddleware, getTasksPaginated);

// Get a single task
router.get('/:id', authMiddleware, getTask);

// Create a new task with file upload
router.post('/', authMiddleware, upload.single('taskFile'), validateTask, createTask);

// Update a task
router.put('/:id', authMiddleware, validateTask, updateTask);

// Delete a task (only admins can delete tasks)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteTask);

// Get tasks by status
router.get('/status/:status', authMiddleware, getTasksByStatus);

// Get tasks by priority
router.get('/priority/:priority', authMiddleware, getTasksByPriority);

// Search tasks
router.get('/search', authMiddleware, searchLimiter, searchTasks);

// Assign task to users
router.post('/:id/assign', authMiddleware, validateAssignment, assignTask);

// Get tasks assigned to the current user
router.get('/assigned', authMiddleware, getAssignedTasks);

module.exports = router;
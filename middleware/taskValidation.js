const { check, validationResult } = require('express-validator');

exports.validateTask = [
  check('title', 'Title is required').not().isEmpty(),
  check('status').isIn(['To Do', 'In Progress', 'Done']),
  check('priority').isIn(['Low', 'Medium', 'High']),
  check('dueDate', 'Invalid date').optional().isISO8601(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

exports.validateAssignment = [
  check('assigneeIds', 'Assignee IDs must be an array').isArray(),
  check('assigneeIds.*', 'Invalid assignee ID').isMongoId(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

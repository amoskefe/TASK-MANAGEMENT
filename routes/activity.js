const express = require('express');
const router = express.Router();
const { getActivityLogs } = require('../controllers/activityController');
const auth = require('../middleware/auth');

router.get('/', auth, getActivityLogs);

module.exports = router;

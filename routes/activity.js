<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const { getActivityLogs } = require('../controllers/activityController');
const auth = require('../middleware/auth');

router.get('/', auth, getActivityLogs);

module.exports = router;
=======
const express = require('express');
const router = express.Router();
const { getActivityLogs } = require('../controllers/activityController');
const auth = require('../middleware/auth');

router.get('/', auth, getActivityLogs);

module.exports = router;
>>>>>>> 7a49a456001b268e5ede99ea44b88b163f8ad76e

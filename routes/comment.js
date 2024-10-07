<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const { addComment, getComments } = require('../controllers/commentController');
const auth = require('../middleware/auth');

router.post('/:taskId', auth, addComment);
router.get('/:taskId', auth, getComments);

module.exports = router;
=======
const express = require('express');
const router = express.Router();
const { addComment, getComments } = require('../controllers/commentController');
const auth = require('../middleware/auth');

router.post('/:taskId', auth, addComment);
router.get('/:taskId', auth, getComments);

module.exports = router;
>>>>>>> 7a49a456001b268e5ede99ea44b88b163f8ad76e

const express = require('express');
const router = express.Router();
const { addComment, getComments } = require('../controllers/commentController');
const auth = require('../middleware/auth');

router.post('/:taskId', auth, addComment);
router.get('/:taskId', auth, getComments);

module.exports = router;

const Comment = require('../Models/Comment');

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const newComment = new Comment({
      task: req.params.taskId,
      user: req.user.id,
      text
    });
    const comment = await newComment.save();
    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ task: req.params.taskId }).sort({ timestamp: -1 });
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

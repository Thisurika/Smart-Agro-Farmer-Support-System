const Feedback = require('../models/Feedback');

// @desc    Create new feedback
// @route   POST /api/feedbacks
// @access  Private
const createFeedback = async (req, res) => {
  try {
    const { name, email, role, message, rating, isAnonymous } = req.body;
    
    // The route is protected, so req.user is available if needed
    
    const feedback = new Feedback({
      name,
      email,
      role,
      message,
      rating,
      isAnonymous: !!isAnonymous
    });

    const createdFeedback = await feedback.save();
    res.status(201).json(createdFeedback);
  } catch (error) {
    res.status(400).json({ message: 'Invalid feedback data', error: error.message });
  }
};

// @desc    Get all feedbacks
// @route   GET /api/feedbacks
// @access  Public (or Private depending on needs, README implies community viewing)
const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({}).sort('-createdAt');
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete feedback
// @route   DELETE /api/feedbacks/:id
// @access  Private/Admin
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (feedback) {
      await Feedback.deleteOne({ _id: feedback._id });
      res.json({ message: 'Feedback removed' });
    } else {
      res.status(404).json({ message: 'Feedback not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  createFeedback,
  getFeedbacks,
  deleteFeedback
};

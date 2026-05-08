const express = require('express');
const router = express.Router();
const { createFeedback, getFeedbacks, deleteFeedback } = require('../controllers/feedbackController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateFeedback } = require('../middleware/validationMiddleware');

router.route('/')
  .post(protect, validateFeedback, createFeedback)
  .get(getFeedbacks);

router.route('/:id')
  .delete(protect, admin, deleteFeedback);

module.exports = router;

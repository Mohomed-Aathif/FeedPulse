const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const { createFeedback } = require('../controllers/feedback.controller');
const { validate } = require('../middleware/validation.middleware');
const { getAllFeedback } = require('../controllers/feedback.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { updateFeedbackStatus, deleteFeedback, getFeedbackById, getFeedbackSummary } = require('../controllers/feedback.controller');

router.get('/', verifyToken, getAllFeedback);
router.get('/summary', verifyToken, getFeedbackSummary);
router.get('/:id', verifyToken, getFeedbackById);
router.patch('/:id', verifyToken, updateFeedbackStatus);
router.delete('/:id', verifyToken, deleteFeedback);

router.post(
  '/',
  [
    body('title')
      .notEmpty().withMessage('Title is required')
      .isLength({ max: 120 }).withMessage('Title must be under 120 characters'),

    body('description')
      .isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),

    body('category')
      .isIn(['Bug', 'Feature Request', 'Improvement', 'Other'])
      .withMessage('Invalid category'),

    body('submitterEmail')
      .optional({ checkFalsy: true })
      .isEmail().withMessage('Invalid email format')
  ],
  validate,
  createFeedback
);

module.exports = router;
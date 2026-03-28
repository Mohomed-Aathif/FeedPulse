const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const { createFeedback } = require('../controllers/feedback.controller');
const { validate } = require('../middleware/validation.middleware');
const { getAllFeedback } = require('../controllers/feedback.controller');

router.get('/', getAllFeedback);

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
      .optional()
      .isEmail().withMessage('Invalid email format')
  ],
  validate,
  createFeedback
);

module.exports = router;
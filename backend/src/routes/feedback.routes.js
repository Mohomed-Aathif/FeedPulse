const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const { createFeedback, getAllFeedback, updateFeedbackStatus, deleteFeedback, getFeedbackById, getFeedbackSummary, reAnalyzeFeedback} = require('../controllers/feedback.controller');
const { validate } = require('../middleware/validation.middleware');
const { verifyToken } = require('../middleware/auth.middleware');

const rateLimit = require('express-rate-limit');

const feedbackLimiter = rateLimit({
windowMs: 60 * 60 * 1000, // 1 hour
max: 5,
message: {
success: false,
message: 'Too many submissions. Try again later.'
}
});

router.get('/', verifyToken, getAllFeedback);
router.get('/summary', verifyToken, getFeedbackSummary);
router.get('/:id', verifyToken, getFeedbackById);
router.patch('/:id', verifyToken, updateFeedbackStatus);
router.delete('/:id', verifyToken, deleteFeedback);
router.post('/:id/reanalyze', verifyToken, reAnalyzeFeedback);

router.post(
'/',
feedbackLimiter,
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

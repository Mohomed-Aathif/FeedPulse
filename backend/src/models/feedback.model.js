const mongoose = require('mongoose');

const CATEGORY_ENUM = ['Bug', 'Feature Request', 'Improvement', 'Other'];
const STATUS_ENUM = ['New', 'In Review', 'Resolved'];
const SENTIMENT_ENUM = ['Positive', 'Neutral', 'Negative'];

const feedbackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 120,
    trim: true
  },

  description: {
    type: String,
    required: true,
    minlength: 20,
    trim: true
  },

  category: {
    type: String,
    enum: CATEGORY_ENUM,
    required: true
  },

  submitterName: {
    type: String,
    trim: true
  },

  submitterEmail: {
    type: String,
    lowercase: true,
    trim: true,
    match: /^\S+@\S+\.\S+$/
  },

  status: {
    type: String,
    enum: STATUS_ENUM,
    default: 'New'
  },

  // AI Fields
  ai_category: {
    type: String
  },

  ai_sentiment: {
    type: String,
    enum: SENTIMENT_ENUM
  },

  ai_priority: {
    type: Number,
    min: 1,
    max: 10
  },

  ai_summary: {
    type: String
  },

  ai_tags: [{
    type: String
  }],

  ai_processed: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
});

// Indexes
feedbackSchema.index({ status: 1 });
feedbackSchema.index({ category: 1 });
feedbackSchema.index({ ai_priority: -1 });
feedbackSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
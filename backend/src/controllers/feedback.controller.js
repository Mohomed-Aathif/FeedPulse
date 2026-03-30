const Feedback = require('../models/feedback.model');
const { analyzeFeedback } = require('../services/gemini.service');

exports.createFeedback = async (req, res) => {
  try {
    const { title, description, category, submitterName, submitterEmail } = req.body;

    const feedback = new Feedback({
      title,
      description,
      category,
      submitterName,
      submitterEmail
    });

    const savedFeedback = await feedback.save();

    // AI processing (async, don't block response)
    analyzeAndUpdate(savedFeedback._id, title, description);

    return res.status(201).json({
      success: true,
      data: savedFeedback,
      message: 'Feedback submitted successfully'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: 'Server error'
    });
  }
};

const analyzeAndUpdate = async (id, title, description) => {
  try {
    const result = await analyzeFeedback(title, description);

    if (!result) return;

    await Feedback.findByIdAndUpdate(id, {
      ai_category: result.category || null,
      ai_sentiment: result.sentiment || null,
      ai_priority: result.priority_score || null,
      ai_summary: result.summary || null,
      ai_tags: result.tags || null,
      ai_processed: true
    });

  } catch (error) {
    console.error('AI update failed:', error.message);
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const { category, status, sentiment, page = 1, limit = 10 } = req.query;

    // Build filter object dynamically
    const filter = {};

    if (category) {
      filter.category = { $regex: new RegExp(category, 'i') }; // Case-insensitive search 
    } 
    if (status) filter.status = status;
    if (sentiment) filter.ai_sentiment = sentiment;

    const skip = (page - 1) * limit;

    const feedbacks = await Feedback.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Feedback.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: feedbacks,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: feedback
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.getFeedbackSummary = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const feedbacks = await Feedback.find({
      createdAt: { $gte: sevenDaysAgo },
      ai_processed: true
    });

    if (feedbacks.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No recent feedback available'
      });
    }

    // Count tags frequency
    const tagCount = {};

    feedbacks.forEach((fb) => {
      (fb.ai_tags || []).forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });

    // Sort top 3
    const topTags = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tag]) => tag);

    return res.status(200).json({
      success: true,
      data: {
        totalFeedback: feedbacks.length,
        topThemes: topTags
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.updateFeedbackStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ['New', 'In Review', 'Resolved'];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const updated = await Feedback.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: updated,
      message: 'Status updated successfully'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Feedback.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
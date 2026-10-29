const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/feedback';

// Middleware
app.use(cors());
app.use(express.json());

// Feedback Schema & Model
const feedbackSchema = new mongoose.Schema({
  q1: {
    type: String,
    required: true,
    trim: true
  },
  q2: {
    type: String,
    required: true,
    trim: true
  },
  q3: {
    type: String,
    required: true,
    trim: true
  },
  q4: {
    type: String,
    required: true,
    trim: true
  },
  q5: {
    type: String,
    required: true,
    trim: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// API Endpoint 1: Submit feedback
app.post('/api/feedback', async (req, res) => {
  try {
    const { q1, q2, q3, q4, q5 } = req.body;

    // Validate that required fields contain meaningful values
    if (
      !q1 || !q1.trim() ||
      !q2 || !q2.trim() ||
      !q3 || !q3.trim() ||
      !q4 || !q4.trim() ||
      !q5 || !q5.trim()
    ) {
      return res.status(400).json({
        message: 'All fields (Name, Department, Session title, Feedback, Suggestions) are required.'
      });
    }

    const newFeedback = new Feedback({
      q1: q1.trim(),
      q2: q2.trim(),
      q3: q3.trim(),
      q4: q4.trim(),
      q5: q5.trim()
    });

    const savedFeedback = await newFeedback.save();
    return res.status(201).json({
      message: 'Feedback submitted successfully!',
      feedback: savedFeedback
    });
  } catch (error) {
    console.error('Error saving feedback:', error);
    return res.status(500).json({
      message: 'Failed to submit feedback. Server error occurred.',
      error: error.message
    });
  }
});

// API Endpoint 2: Retrieve all feedback
app.get('/api/getfeedback', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ submittedAt: -1 });
    return res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error retrieving feedback:', error);
    return res.status(500).json({
      message: 'Failed to retrieve feedback records.',
      error: error.message
    });
  }
});

// Connect to MongoDB and start listening only on success
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log(`Connected to MongoDB successfully at: ${MONGODB_URI}`);
    app.listen(PORT, () => {
      console.log(`Server is running and listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

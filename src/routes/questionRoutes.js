const express = require('express');
const Question = require('../models/Question');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/questions/classroom/:classroomId
// @desc    Get all questions for a specific classroom
// @access  Private
router.get('/classroom/:classroomId', protect, async (req, res) => {
    try {
        const questions = await Question.find({ classroom: req.params.classroomId })
            .populate('student', 'name')
            .sort({ createdAt: -1 });
        
        // Optionally sort by upvotes if preferred for initial load
        questions.sort((a, b) => b.upvotes.length - a.upvotes.length);

        res.json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;

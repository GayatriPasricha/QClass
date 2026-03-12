const express = require('express');
const Classroom = require('../models/Classroom');
const Question = require('../models/Question');
const { protect, teacherOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/analytics/classroom/:id
// @desc    Get analytics for a specific classroom
// @access  Private/Teacher
router.get('/classroom/:id', protect, teacherOnly, async (req, res) => {
    try {
        const classroom = await Classroom.findById(req.params.id);

        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        // Verify teacher owns this room
        if (classroom.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized for this classroom' });
        }

        const totalStudents = classroom.students.length;

        // Get questions for this room
        const questions = await Question.find({ classroom: classroom._id });

        const totalQuestions = questions.length;
        let answeredQuestions = 0;
        let pendingQuestions = 0;
        let pinnedQuestions = 0;

        let totalUpvotes = 0;

        questions.forEach(q => {
            if (q.status === 'answered') answeredQuestions++;
            if (q.status === 'pending') pendingQuestions++;
            if (q.status === 'pinned') pinnedQuestions++;

            totalUpvotes += q.upvotes.length;
        });

        const answeredRatio = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

        res.json({
            classroomName: classroom.name,
            totalStudents,
            totalQuestions,
            answeredQuestions,
            pendingQuestions,
            pinnedQuestions,
            totalUpvotes,
            answeredRatio: answeredRatio.toFixed(2) + '%',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/analytics/dashboard
// @desc    Get overall dashboard analytics for a teacher
// @access  Private/Teacher
router.get('/dashboard', protect, teacherOnly, async (req, res) => {
    try {
        const classrooms = await Classroom.find({ teacher: req.user._id });

        const totalClassrooms = classrooms.length;
        let totalStudents = 0;
        const classroomIds = classrooms.map(c => c._id);

        classrooms.forEach(c => {
            totalStudents += c.students.length;
        });

        // Get all questions in all classrooms owned by this teacher
        const questions = await Question.find({ classroom: { $in: classroomIds } });

        const totalQuestions = questions.length;
        const answeredQuestions = questions.filter(q => q.status === 'answered').length;

        // questions asked today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const questionsToday = questions.filter(q => new Date(q.createdAt) >= startOfDay).length;

        res.json({
            metrics: {
                totalClassrooms,
                totalStudents,
                totalQuestions,
                answeredQuestions,
                questionsToday
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;

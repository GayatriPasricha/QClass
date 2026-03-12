const express = require('express');
const Classroom = require('../models/Classroom');
const { protect, teacherOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Generate a random 6 character alphanumeric code
const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// @route   POST /api/classrooms
// @desc    Create a new classroom
// @access  Private/Teacher
router.post('/', protect, teacherOnly, async (req, res) => {
    const { name, subject, description } = req.body;

    try {
        let code = generateRoomCode();
        // Ensure code is unique
        let existingRoom = await Classroom.findOne({ code });
        while (existingRoom) {
            code = generateRoomCode();
            existingRoom = await Classroom.findOne({ code });
        }

        const classroom = await Classroom.create({
            name,
            subject,
            description,
            code,
            teacher: req.user._id,
        });

        res.status(201).json(classroom);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/classrooms/teacher
// @desc    Get all classrooms created by the logged in teacher
// @access  Private/Teacher
router.get('/teacher', protect, teacherOnly, async (req, res) => {
    try {
        const classrooms = await Classroom.find({ teacher: req.user._id }).sort({ createdAt: -1 });
        res.json(classrooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/classrooms/join
// @desc    Join a classroom using a code
// @access  Private/Student
router.post('/join', protect, async (req, res) => {
    const { code } = req.body;

    try {
        const classroom = await Classroom.findOne({ code: code.toUpperCase() });

        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        // Check if student is already in the classroom
        if (classroom.students.includes(req.user._id)) {
            return res.status(400).json({ message: 'Already joined this classroom' });
        }

        classroom.students.push(req.user._id);
        await classroom.save();

        res.json({ message: 'Successfully joined classroom', classroom });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/classrooms/student
// @desc    Get all classrooms joined by the logged in student
// @access  Private
router.get('/student', protect, async (req, res) => {
    try {
        const classrooms = await Classroom.find({ students: req.user._id })
            .populate('teacher', 'name')
            .sort({ createdAt: -1 });
        res.json(classrooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/classrooms/:id
// @desc    Get classroom by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const classroom = await Classroom.findById(req.params.id).populate('teacher', 'name');

        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        // Make sure user is either the teacher or a joined student
        if (
            classroom.teacher._id.toString() !== req.user._id.toString() &&
            !classroom.students.includes(req.user._id)
        ) {
            return res.status(403).json({ message: 'Not authorized to access this classroom' });
        }

        res.json(classroom);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;

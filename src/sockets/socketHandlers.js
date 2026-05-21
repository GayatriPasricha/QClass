const Question = require('../models/Question');

const socketHandlers = (io) => {
    io.on('connection', (socket) => {
        console.log(`User connected to socket: ${socket.id}`);

        // Join a specific classroom room
        socket.on('join_classroom', ({ classroomId }) => {
            socket.join(classroomId);
            console.log(`User joined classroom: ${classroomId}`);
        });

        // Leave a classroom room
        socket.on('leave_classroom', ({ classroomId }) => {
            socket.leave(classroomId);
            console.log(`User left classroom: ${classroomId}`);
        });

        // Ask a new question
        socket.on('ask_question', async (data) => {
            const { classroomId, studentId, text } = data;
            try {
                const newQuestion = await Question.create({
                    text,
                    student: studentId,
                    classroom: classroomId,
                });

                const populatedQuestion = await Question.findById(newQuestion._id).populate('student', 'name');

                // Broadcast to everyone in the room
                io.to(classroomId).emit('new_question', populatedQuestion);
            } catch (error) {
                console.error('Error asking question:', error);
            }
        });

        // Upvote a question
        socket.on('upvote_question', async (data) => {
            const { questionId, studentId, classroomId } = data;
            try {
                const question = await Question.findById(questionId);

                if (question && !question.upvotes.some(id => id.toString() === studentId.toString())) {
                    question.upvotes.push(studentId);
                    await question.save();

                    // Broadcast the updated question upvotes
                    io.to(classroomId).emit('question_upvoted', {
                        questionId,
                        upvotes: question.upvotes,
                    });
                }
            } catch (error) {
                console.error('Error upvoting question:', error);
            }
        });

        // Teacher actions: mark answered or pinned
        socket.on('teacher_action', async (data) => {
            const { questionId, action, classroomId } = data;
            // action can be 'answered' or 'pinned'
            try {
                const question = await Question.findById(questionId);
                if (question) {
                    question.status = action;
                    await question.save();

                    io.to(classroomId).emit('question_status_changed', {
                        questionId,
                        status: question.status,
                    });
                }
            } catch (error) {
                console.error('Error changing question status:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};

module.exports = socketHandlers;

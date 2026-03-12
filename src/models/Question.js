const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        classroom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Classroom',
            required: true,
        },
        upvotes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        status: {
            type: String,
            enum: ['pending', 'answered', 'pinned'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;

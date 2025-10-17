// C:\Users\harin\LMS-Hackathon\lms-backend\models\Student.js

const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    rollNo: { // Student roll number
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    enrolledCourses: [{
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        enrolledAt: {
            type: Date,
            default: Date.now
        },
        marks: {
            type: Number,
            default: null
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
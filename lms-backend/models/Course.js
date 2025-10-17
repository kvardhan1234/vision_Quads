// lms-backend/models/Course.js (UPDATED)

const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    duration: { type: String, default: 'Self-Paced' },
    deadline: { type: Date },
    instructor: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    files: [{ // PPT, PDF uploads
        filename: String,
        path: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    assignmentEnabled: {
        type: Boolean,
        default: false
    },
    enrollments: [{ 
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        },
        enrolledAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
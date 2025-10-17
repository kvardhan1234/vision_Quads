const mongoose = require('mongoose');

const AssignmentSubmissionSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    studentRollNo: {
        type: String,
        required: true
    },
    assignmentFile: {
        filename: String,
        path: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    },
    marks: {
        type: Number,
        default: null
    },
    feedback: {
        type: String,
        default: ''
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('AssignmentSubmission', AssignmentSubmissionSchema);

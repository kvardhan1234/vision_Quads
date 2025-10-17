// C:\Users\harin\LMS-Hackathon\lms-backend\models\User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
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
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Staff', 'Teacher', 'Admin'],
        default: 'Teacher'
    },
    teacherId: { // Teacher ID number
        type: String,
        sparse: true // Only for teachers
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
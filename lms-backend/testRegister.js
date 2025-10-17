// Test registration script
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const Student = require('./models/Student');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI;
const SALT_ROUNDS = 10;

async function registerTestUsers() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected!');

        // Register Student
        const studentExists = await Student.findOne({ email: 'vardhan@gmail.com' });
        if (studentExists) {
            console.log('Student already exists, deleting...');
            await Student.deleteOne({ email: 'vardhan@gmail.com' });
        }

        const studentPasswordHash = await bcrypt.hash('pass123', SALT_ROUNDS);
        const newStudent = new Student({
            name: 'Vardhan',
            email: 'vardhan@gmail.com',
            passwordHash: studentPasswordHash,
            rollNo: 'STU001'
        });
        await newStudent.save();
        console.log('✅ Student registered: vardhan@gmail.com / pass123 / Roll: STU001');

        // Register Teacher
        const teacherExists = await User.findOne({ email: 'vardhan1@gmail.com' });
        if (teacherExists) {
            console.log('Teacher already exists, deleting...');
            await User.deleteOne({ email: 'vardhan1@gmail.com' });
        }

        const teacherPasswordHash = await bcrypt.hash('pass123', SALT_ROUNDS);
        const newTeacher = new User({
            name: 'Vardhan Teacher',
            email: 'vardhan1@gmail.com',
            passwordHash: teacherPasswordHash,
            role: 'Teacher',
            teacherId: 'TCH001'
        });
        await newTeacher.save();
        console.log('✅ Teacher registered: vardhan1@gmail.com / pass123 / Teacher ID: TCH001');

        console.log('\n✅ All test accounts created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

registerTestUsers();

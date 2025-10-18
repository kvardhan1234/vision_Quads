// server.js (MySQL with Sequelize)

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');

// Import Sequelize models and database connection
const {
  sequelize,
  User,
  Student,
  Course,
  Enrollment,
  Event,
  AssignmentSubmission
} = require('./models/index');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL || '*'
        : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Request body:', req.body);
    next();
});

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadDir));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Connect to MySQL and sync models
sequelize.authenticate()
  .then(() => {
    console.log('✅ MySQL connection successful!');
    return sequelize.sync({ alter: true }); // Creates tables if they don't exist
  })
  .then(() => console.log('✅ Database tables synchronized!'))
  .catch(err => console.error('❌ MySQL connection error:', err));

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit!');
  res.json({ message: 'Backend is working with MySQL!', timestamp: new Date() });
});

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('Health check hit!');
  sequelize.authenticate()
    .then(() => res.json({ status: 'OK', port: PORT, database: 'MySQL - Connected' }))
    .catch(() => res.json({ status: 'ERROR', port: PORT, database: 'MySQL - Disconnected' }));
});

// --- HELPER FUNCTION (using bcrypt) ---
const SALT_ROUNDS = 10;

// --- AUTH ROUTES ---

// Register Staff/Teacher (User)
app.post('/api/register', async (req, res) => {
	console.log('Teacher registration request received:', req.body);
	const {name, email, password, role = 'Teacher', teacherId} = req.body || {};
	if (!name || !email || !password) {
		console.log('Missing required fields');
		return res.status(400).json({error: 'name, email and password are required'});
	}

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
        	console.log('User already exists:', email);
        	return res.status(409).json({error: 'user already exists'});
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        
        const newUser = await User.create({ name, email, passwordHash, role, teacherId });
        console.log('Teacher registered successfully:', email);

        const {passwordHash: _, ...safeUser} = newUser.toJSON();
        res.status(201).json({user: safeUser});
    } catch (err) {
        console.error("Staff Registration Error:", err);
        res.status(500).json({error: 'internal_server_error'});
    }
});

// Register Student
app.post('/api/register-student', async (req, res) => {
	console.log('Student registration request received:', req.body);
	const {name, email, password, rollNo} = req.body || {};
	if (!name || !email || !password || !rollNo) {
		console.log('Missing required fields');
		return res.status(400).json({error: 'name, email, password and rollNo are required'});
	}

    try {
        const existingStudent = await Student.findOne({ 
            where: { 
                [Op.or]: [{ email }, { rollNo }] 
            } 
        });
        if (existingStudent) {
        	console.log('Student already exists:', email, rollNo);
        	return res.status(409).json({error: 'student already exists'});
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        
        const newStudent = await Student.create({ name, email, passwordHash, rollNo });
        console.log('Student registered successfully:', email);

        const {passwordHash: _, ...safeStudent} = newStudent.toJSON();
        res.status(201).json({student: safeStudent});
    } catch (err) {
        console.error("Student Registration Error:", err);
        res.status(500).json({error: 'internal_server_error'});
    }
});

// Login Staff/Teacher (User)
app.post('/api/login', async (req, res) => {
	const {email, password} = req.body || {};
	if (!email || !password) return res.status(400).json({error: 'email and password required'});

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            // Check if email exists in Student table
            const studentExists = await Student.findOne({ where: { email } });
            if (studentExists) {
                return res.status(401).json({error: 'This email is registered as a student. Please use the Student Login page.'});
            }
            return res.status(401).json({error: 'invalid credentials'});
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(401).json({error: 'invalid credentials'});

        const {passwordHash: _, ...safeUser} = user.toJSON();
        res.json({user: safeUser});
    } catch (err) {
        console.error("Staff Login Error:", err);
        res.status(500).json({error: 'internal_server_error'});
    }
});

// Student login (supports both email and rollNo)
app.post('/api/login-student', async (req, res) => {
	const {identifier, password} = req.body || {}; // identifier can be email or rollNo
	if (!identifier || !password) return res.status(400).json({error: 'identifier (email or rollNo) and password required'});

    try {
        // Find student by email or rollNo
        const student = await Student.findOne({ 
            where: {
                [Op.or]: [{ email: identifier }, { rollNo: identifier }]
            }
        });
        if (!student) {
            // Check if email exists in User (teacher) table
            const teacherExists = await User.findOne({ where: { email: identifier } });
            if (teacherExists) {
                return res.status(401).json({error: 'This email is registered as a teacher. Please use the Teacher/Admin Login page.'});
            }
            return res.status(401).json({error: 'invalid credentials'});
        }

        const isMatch = await bcrypt.compare(password, student.passwordHash);
        if (!isMatch) return res.status(401).json({error: 'invalid credentials'});

        const {passwordHash: _, ...safeStudent} = student.toJSON();
        res.json({student: safeStudent});
    } catch (err) {
        console.error("Student Login Error:", err);
        res.status(500).json({error: 'internal_server_error'});
    }
});

// --- COURSE ROUTES ---

// Get all courses (for student dashboard/overview)
app.get('/api/courses', async (req, res) => {
    try {
        const coursesList = await Course.findAll({
            include: [
                {
                    model: User,
                    as: 'instructor',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Enrollment,
                    as: 'enrollments',
                    include: [{
                        model: Student,
                        as: 'student',
                        attributes: ['id', 'name', 'rollNo']
                    }]
                }
            ]
        });

        res.json({courses: coursesList});
    } catch (err) {
        console.error("Get Courses Error:", err);
        res.status(500).json({error: 'internal_server_error'});
    }
});

// Get courses created by a specific instructor (Teacher functionality)
app.get('/api/courses/instructor/:instructorId', async (req, res) => {
    try {
        const { instructorId } = req.params;
        
        const coursesList = await Course.findAll({ where: { instructorId },
            include: [
                {
                    model: User,
                    as: 'instructor',
                    attributes: ['name', 'email']
                },
                {
                    model: Enrollment,
                    as: 'enrollments',
                    include: [{
                        model: Student,
                        as: 'student',
                        attributes: ['id', 'name', 'rollNo']
                    }]
                }
            ]
        });

        res.json({courses: coursesList}); 
    } catch (err) {
        console.error("Get Instructor Courses Error:", err);
        res.status(500).json({error: 'internal_server_error'});
    }
});

// Create a course (Teacher functionality) with file uploads
app.post('/api/courses', upload.array('files', 10), async (req, res) => {
	const {title, description, duration, deadline, instructorId, assignmentEnabled} = req.body || {}; 
	if (!title || !description || !instructorId) {
        return res.status(400).json({error: 'title, description, and instructorId are required'});
    }

    try {
        const instructor = await User.findByPk(instructorId);
        if (!instructor) return res.status(404).json({error: 'Instructor not found'});

        // Process uploaded files
        const files = req.files ? req.files.map(file => ({
            filename: file.originalname,
            path: `/uploads/${file.filename}`
        })) : [];

        const newCourse = await Course.create({ 
            title, 
            description, 
            duration: duration || 'Self-Paced',
            deadline: deadline ? new Date(deadline) : null,
            instructorId,
            files,
            assignmentEnabled: assignmentEnabled === 'true' || assignmentEnabled === true
        });

        const populatedCourse = await Course.findByPk(newCourse.id, {
            include: [{
                model: User,
                as: 'instructor',
                attributes: ['name', 'email']
            }]
        });

        res.status(201).json({course: populatedCourse});
    } catch (err) {
        console.error("Create Course Error:", err);
        res.status(500).json({error: 'internal_server_error'});
    }
});

// Enroll student in a course
app.post('/api/courses/:courseId/enroll', async (req, res) => {
    const { courseId } = req.params;
    const { studentId } = req.body;

    if (!studentId) return res.status(400).json({error: 'studentId is required'});

    try {
        const course = await Course.findByPk(courseId);
        if (!course) return res.status(404).json({error: 'Course not found'});

        const student = await Student.findByPk(studentId);
        if (!student) return res.status(404).json({error: 'Student not found'});

        // Check if already enrolled
        const alreadyEnrolled = await Enrollment.findOne({
            where: { studentId, courseId }
        });
        if (alreadyEnrolled) {
            return res.status(409).json({error: 'Already enrolled in this course'});
        }

        // Create enrollment
        await Enrollment.create({ studentId, courseId });

        const updatedCourse = await Course.findByPk(courseId, {
            include: [
                {
                    model: User,
                    as: 'instructor',
                    attributes: ['name', 'email']
                },
                {
                    model: Enrollment,
                    as: 'enrollments',
                    include: [{
                        model: Student,
                        as: 'student',
                        attributes: ['name', 'rollNo']
                    }]
                }
            ]
        });

        res.json({course: updatedCourse});
    } catch (err) {
        console.error("Enrollment Error:", err);
        res.status(500).json({error: 'internal_server_error'});
    }
});

// Get student's enrolled courses
app.get('/api/students/:studentId/courses', async (req, res) => {
    const { studentId } = req.params;

    try {
        const enrollments = await Enrollment.findAll({
            where: { studentId },
            include: [{
                model: Course,
                as: 'course',
                include: [{
                    model: User,
                    as: 'instructor',
                    attributes: ['name', 'email']
                }]
            }],
            order: [['enrolledAt', 'DESC']]
        });

        // Format response to match frontend expectations
        const courses = enrollments.map(enrollment => ({
            courseId: enrollment.course,
            marks: enrollment.marks,
            enrolledAt: enrollment.enrolledAt
        }));

        res.json({courses});
    } catch (err) {
        console.error("Get Student Courses Error:", err);
        res.status(500).json({error: 'internal_server_error'});
    }
});

// --- EVENT ROUTES ---

// Get all events
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.findAll({
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['name']
                },
                {
                    model: Course,
                    as: 'course',
                    attributes: ['title']
                }
            ],
            order: [['eventDate', 'ASC']]
        });

        res.json({events});
    } catch (err) {
        console.error("Get Events Error:", err);
        res.status(500).json({error: 'internal_server_error'});
    }
});

// Create an event
app.post('/api/events', async (req, res) => {
    const { title, description, eventDate, createdBy, relatedCourse } = req.body;

    if (!title || !description || !eventDate || !createdBy) {
        return res.status(400).json({error: 'title, description, eventDate, and createdBy are required'});
    }

    try {
        const newEvent = await Event.create({
            title,
            description,
            eventDate: new Date(eventDate),
            createdBy,
            relatedCourse
        });

        const populatedEvent = await Event.findByPk(newEvent.id, {
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['name']
                },
                {
                    model: Course,
                    as: 'course',
                    attributes: ['title']
                }
            ]
        });

        res.status(201).json({event: populatedEvent});
    } catch (err) {
        console.error("Create Event Error:", err);
        res.status(500).json({error: 'internal_server_error'});
    }
});

// --- ASSIGNMENT SUBMISSION ROUTES ---

// Submit assignment
app.post('/api/assignments/submit', upload.single('assignmentFile'), async (req, res) => {
    const { courseId, studentId, studentName, studentRollNo } = req.body;

    if (!courseId || !studentId || !studentName || !studentRollNo) {
        return res.status(400).json({error: 'courseId, studentId, studentName, and studentRollNo are required'});
    }

    try {
        const course = await Course.findByPk(courseId);
        if (!course) return res.status(404).json({error: 'Course not found'});

        if (!course.assignmentEnabled) {
            return res.status(403).json({error: 'Assignments are not enabled for this course'});
        }

        // Check if already submitted
        const existingSubmission = await AssignmentSubmission.findOne({ 
            where: { courseId, studentId } 
        });
        if (existingSubmission) {
            return res.status(409).json({error: 'Assignment already submitted'});
        }

        const assignmentFile = req.file ? {
            filename: req.file.originalname,
            path: `/uploads/${req.file.filename}`
        } : null;

        const submission = await AssignmentSubmission.create({
            courseId,
            studentId,
            studentName,
            studentRollNo,
            assignmentFile
        });

        res.status(201).json({submission});
    } catch (err) {
        console.error("Submit Assignment Error:", err);
        res.status(500).json({error: 'internal_server_error'});
    }
});

// Get all submissions for a course
app.get('/api/courses/:courseId/submissions', async (req, res) => {
    const { courseId } = req.params;

    try {
        const submissions = await AssignmentSubmission.findAll({
            where: { courseId },
            include: [{
                model: Student,
                as: 'student',
                attributes: ['name', 'email', 'rollNo']
            }],
            order: [['submittedAt', 'DESC']]
        });

        res.json({submissions});
    } catch (err) {
        console.error("Get Submissions Error:", err);
        res.status(500).json({error: 'internal_server_error'});
    }
});

// Get all submissions by a teacher (for all their courses)
app.get('/api/teacher/:teacherId/submissions', async (req, res) => {
    const { teacherId } = req.params;

    try {
        // Find all courses by this teacher
        const courses = await Course.findAll({ 
            where: { instructorId: teacherId },
            attributes: ['id']
        });
        const courseIds = courses.map(c => c.id);

        // Find all submissions for these courses
        const submissions = await AssignmentSubmission.findAll({
            where: { 
                courseId: { [Op.in]: courseIds } 
            },
            include: [
                {
                    model: Course,
                    as: 'course',
                    attributes: ['title']
                },
                {
                    model: Student,
                    as: 'student',
                    attributes: ['name', 'email', 'rollNo']
                }
            ],
            order: [['submittedAt', 'DESC']]
        });

        res.json({submissions});
    } catch (err) {
        console.error("Get Teacher Submissions Error:", err);
        res.status(500).json({error: 'internal_server_error'});
    }
});

// Grade an assignment submission
app.put('/api/assignments/:submissionId/grade', async (req, res) => {
    const { submissionId } = req.params;
    const { marks, feedback } = req.body;

    if (marks === undefined) {
        return res.status(400).json({error: 'marks are required'});
    }

    try {
        const submission = await AssignmentSubmission.findByPk(submissionId);
        if (!submission) return res.status(404).json({error: 'Submission not found'});

        submission.marks = marks;
        submission.feedback = feedback || '';
        await submission.save();

        // Update student's course marks in enrollment
        const enrollment = await Enrollment.findOne({
            where: {
                studentId: submission.studentId,
                courseId: submission.courseId
            }
        });
        if (enrollment) {
            enrollment.marks = marks;
            await enrollment.save();
        }

        const populatedSubmission = await AssignmentSubmission.findByPk(submissionId, {
            include: [
                {
                    model: Course,
                    as: 'course',
                    attributes: ['title']
                },
                {
                    model: Student,
                    as: 'student',
                    attributes: ['name', 'email', 'rollNo']
                }
            ]
        });

        res.json({submission: populatedSubmission});
    } catch (err) {
        console.error("Grade Assignment Error:", err);
        res.status(500).json({error: 'internal_server_error'});
    }
});

// Basic error handler
app.use((err, req, res, next) => {
	console.error(err && err.stack ? err.stack : err);
	res.status(500).json({error: 'internal_server_error'});
});

app.listen(PORT, () => {
	console.log(`🚀 LMS backend with MySQL listening on port ${PORT}`);
});

module.exports = app;

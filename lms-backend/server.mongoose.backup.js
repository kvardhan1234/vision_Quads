// server.js (Final Code with Mongoose Integration)

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Import Mongoose Models
const User = require('./models/User'); 
const Student = require('./models/Student');
const Course = require('./models/Course');
const Event = require('./models/Event');
const AssignmentSubmission = require('./models/AssignmentSubmission');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI; 

// Enhanced CORS configuration
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177'],
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

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connection successful!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit!');
  res.json({ message: 'Backend is working!', timestamp: new Date() });
});

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('Health check hit!');
  res.json({ status: 'OK', port: PORT, mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
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
        const existingUser = await User.findOne({ email });
        if (existingUser) {
        	console.log('User already exists:', email);
        	return res.status(409).json({error: 'user already exists'});
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        
        const newUser = new User({ name, email, passwordHash, role, teacherId });
        await newUser.save();
        console.log('Teacher registered successfully:', email);

        const {passwordHash: _, ...safeUser} = newUser.toObject();
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
        const existingStudent = await Student.findOne({ $or: [{ email }, { rollNo }] });
        if (existingStudent) {
        	console.log('Student already exists:', email, rollNo);
        	return res.status(409).json({error: 'student already exists'});
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        
        const newStudent = new Student({ name, email, passwordHash, rollNo });
        await newStudent.save();
        console.log('Student registered successfully:', email);

        const {passwordHash: _, ...safeStudent} = newStudent.toObject();
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
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({error: 'invalid credentials'});

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(401).json({error: 'invalid credentials'});

        const {passwordHash: _, ...safeUser} = user.toObject();
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
            $or: [{ email: identifier }, { rollNo: identifier }] 
        });
        if (!student) return res.status(401).json({error: 'invalid credentials'});

        const isMatch = await bcrypt.compare(password, student.passwordHash);
        if (!isMatch) return res.status(401).json({error: 'invalid credentials'});

        const {passwordHash: _, ...safeStudent} = student.toObject();
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
        const coursesList = await Course.find({})
                                        .populate('instructor', 'name email')
                                        .populate('enrollments.studentId', 'name rollNo');

        res.json({courses: coursesList});
    } catch (err) {
        console.error("Get Courses Error:", err);
        res.status(500).json({error: 'internal_server_error'});
    }
});

// NEW: Get courses created by a specific instructor (Teacher functionality)
app.get('/api/courses/instructor/:instructorId', async (req, res) => {
    try {
        const { instructorId } = req.params;
        
        // Find courses where the 'instructor' field matches the ID
        const coursesList = await Course.find({ instructor: instructorId })
                                        .populate('instructor', 'name email -_id')
                                        .select('-enrollments');

        // PROBLEM: The response is JSON with an object wrapper: {courses: coursesList}
        res.json({courses: coursesList}); 
    } catch (err) {
        // ...
    }
});

// Create a course (Teacher functionality) with file uploads
app.post('/api/courses', upload.array('files', 10), async (req, res) => {
	const {title, description, duration, deadline, instructorId, assignmentEnabled} = req.body || {}; 
	if (!title || !description || !instructorId) {
        return res.status(400).json({error: 'title, description, and instructorId are required'});
    }

    try {
        const instructor = await User.findById(instructorId);
        if (!instructor) return res.status(404).json({error: 'Instructor not found'});

        // Process uploaded files
        const files = req.files ? req.files.map(file => ({
            filename: file.originalname,
            path: `/uploads/${file.filename}`
        })) : [];

        const newCourse = new Course({ 
            title, 
            description, 
            duration: duration || 'Self-Paced',
            deadline: deadline ? new Date(deadline) : null,
            instructor: instructorId,
            files,
            assignmentEnabled: assignmentEnabled === 'true' || assignmentEnabled === true
        });
        await newCourse.save();

        const populatedCourse = await Course.findById(newCourse._id)
            .populate('instructor', 'name email');

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
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({error: 'Course not found'});

        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({error: 'Student not found'});

        // Check if already enrolled
        const alreadyEnrolled = course.enrollments.some(
            enrollment => enrollment.studentId.toString() === studentId
        );
        if (alreadyEnrolled) {
            return res.status(409).json({error: 'Already enrolled in this course'});
        }

        // Add to course enrollments
        course.enrollments.push({ studentId });
        await course.save();

        // Add to student's enrolled courses
        student.enrolledCourses.push({ courseId });
        await student.save();

        const updatedCourse = await Course.findById(courseId)
            .populate('instructor', 'name email')
            .populate('enrollments.studentId', 'name rollNo');

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
        const student = await Student.findById(studentId)
            .populate({
                path: 'enrolledCourses.courseId',
                populate: { path: 'instructor', select: 'name email' }
            });

        if (!student) return res.status(404).json({error: 'Student not found'});

        res.json({courses: student.enrolledCourses});
    } catch (err) {
        console.error("Get Student Courses Error:", err);
        res.status(500).json({error: 'internal_server_error'});
    }
});

// --- EVENT ROUTES ---

// Get all events
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find({})
            .populate('createdBy', 'name')
            .populate('relatedCourse', 'title')
            .sort({ eventDate: 1 });

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
        const newEvent = new Event({
            title,
            description,
            eventDate: new Date(eventDate),
            createdBy,
            relatedCourse
        });

        await newEvent.save();

        const populatedEvent = await Event.findById(newEvent._id)
            .populate('createdBy', 'name')
            .populate('relatedCourse', 'title');

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
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({error: 'Course not found'});

        if (!course.assignmentEnabled) {
            return res.status(403).json({error: 'Assignments are not enabled for this course'});
        }

        // Check if already submitted
        const existingSubmission = await AssignmentSubmission.findOne({ courseId, studentId });
        if (existingSubmission) {
            return res.status(409).json({error: 'Assignment already submitted'});
        }

        const assignmentFile = req.file ? {
            filename: req.file.originalname,
            path: `/uploads/${req.file.filename}`
        } : null;

        const submission = new AssignmentSubmission({
            courseId,
            studentId,
            studentName,
            studentRollNo,
            assignmentFile
        });

        await submission.save();

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
        const submissions = await AssignmentSubmission.find({ courseId })
            .populate('studentId', 'name email rollNo')
            .sort({ submittedAt: -1 });

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
        const courses = await Course.find({ instructor: teacherId });
        const courseIds = courses.map(c => c._id);

        // Find all submissions for these courses
        const submissions = await AssignmentSubmission.find({ courseId: { $in: courseIds } })
            .populate('courseId', 'title')
            .populate('studentId', 'name email rollNo')
            .sort({ submittedAt: -1 });

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
        const submission = await AssignmentSubmission.findById(submissionId);
        if (!submission) return res.status(404).json({error: 'Submission not found'});

        submission.marks = marks;
        submission.feedback = feedback || '';
        await submission.save();

        // Update student's course marks
        const student = await Student.findById(submission.studentId);
        if (student) {
            const enrolledCourse = student.enrolledCourses.find(
                ec => ec.courseId.toString() === submission.courseId.toString()
            );
            if (enrolledCourse) {
                enrolledCourse.marks = marks;
                await student.save();
            }
        }

        const populatedSubmission = await AssignmentSubmission.findById(submissionId)
            .populate('courseId', 'title')
            .populate('studentId', 'name email rollNo');

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
	console.log(`LMS backend listening on port ${PORT}`);
});

module.exports = app;
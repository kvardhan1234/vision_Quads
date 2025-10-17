// server.js (Final and Consolidated Code)

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Import Mongoose Models
const User = require('./models/User'); 
const Student = require('./models/Student');
const Course = require('./models/Course');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI; 

app.use(cors());
app.use(express.json());

// ------------------------------------------------------------------
// **SWAGGER/OPENAPI SETUP**
// ------------------------------------------------------------------
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'LMS Portal API Documentation',
            version: '1.0.0',
            description: 'API endpoints for student and staff registration, login, and course management.'
        },
        servers: [
            {
                url: 'http://localhost:5000',
            },
        ],
    },
    apis: ['./server.js'], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// ------------------------------------------------------------------

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connection successful!'))
  .catch(err => console.error('MongoDB connection error:', err));


// --- HELPER FUNCTION ---
const SALT_ROUNDS = 10;

// --- AUTH ROUTES ---

/**
 * @swagger
 * /api/register:
 * post:
 * summary: Register a new Staff/Teacher (User)
 * tags: [Authentication (Staff/Teacher)]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - name
 * - email
 * - password
 * properties:
 * name: { type: string }
 * email: { type: string }
 * password: { type: string }
 * role:
 * type: string
 * description: 'Role, defaults to Staff (e.g., Staff, Teacher, Admin)'
 * responses:
 * 201: { description: Staff/Teacher successfully created. }
 * 400: { description: Missing required fields. }
 * 409: { description: User already exists. }
 * 500: { description: Server error. }
 */
app.post('/api/register', async (req, res) => {
    const {name, email, password, role = 'Staff'} = req.body || {};
    if (!name || !email || !password) return res.status(400).json({error: 'name, email and password are required'});

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(409).json({error: 'user already exists'});

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        
        const newUser = new User({ name, email, passwordHash, role });
        await newUser.save();

        const {passwordHash: _, ...safeUser} = newUser.toObject();
        res.status(201).json({user: safeUser});
    } catch (err) {
        console.error("Staff Registration Error:", err.message);
        res.status(500).json({error: err.message || 'internal_server_error'});
    }
});

/**
 * @swagger
 * /api/register-student:
 * post:
 * summary: Register a new Student
 * tags: [Authentication (Student)]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - name
 * - email
 * - password
 * properties:
 * name: { type: string }
 * email: { type: string }
 * password: { type: string }
 * responses:
 * 201: { description: Student successfully created. }
 * 400: { description: Missing required fields. }
 * 409: { description: Student already exists. }
 * 500: { description: Server error. }
 */
app.post('/api/register-student', async (req, res) => {
    const {name, email, password} = req.body || {};
    
    if (!name || !email || !password) return res.status(400).json({error: 'name, email and password are required'});

    try {
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) return res.status(409).json({error: 'student already exists'});

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        
        const newStudent = new Student({ name, email, passwordHash });
        await newStudent.save();

        const {passwordHash: _, ...safeStudent} = newStudent.toObject();
        res.status(201).json({student: safeStudent});
    } catch (err) {
        console.error("Student Registration Error:", err.message);
        res.status(500).json({error: err.message || 'internal_server_error'});
    }
});


/**
 * @swagger
 * /api/login:
 * post:
 * summary: Staff/Teacher Login
 * tags: [Authentication (Staff/Teacher)]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - email
 * - password
 * properties:
 * email: { type: string }
 * password: { type: string }
 * responses:
 * 200: { description: Login successful. Returns user object. }
 * 400: { description: Email and password required. }
 * 401: { description: Invalid credentials. }
 * 500: { description: Server error. }
 */
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

/**
 * @swagger
 * /api/login-student:
 * post:
 * summary: Student Login
 * tags: [Authentication (Student)]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - email
 * - password
 * properties:
 * email: { type: string }
 * password: { type: string }
 * responses:
 * 200: { description: Login successful. Returns student object. }
 * 400: { description: Email and password required. }
 * 401: { description: Invalid credentials. }
 * 500: { description: Server error. }
 */
app.post('/api/login-student', async (req, res) => {
    const {email, password} = req.body || {};
    if (!email || !password) return res.status(400).json({error: 'email and password required'});

    try {
        const student = await Student.findOne({ email });
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

app.get('/api/courses', async (req, res) => {
    try {
        // Find all courses and populate the instructor's name (excluding the passwordHash)
        const coursesList = await Course.find({})
                                        .populate('instructor', 'name -_id')
                                        .select('-enrollments'); 

        res.json({courses: coursesList});
    } catch (err) {
        console.error("Get Courses Error:", err);
        res.status(500).json({error: 'internal_server_error'});
    }
});

app.post('/api/courses', async (req, res) => {
    // For this demo, we'll assume instructor is passed as a name/ID in the body
    const {title, description, duration, instructorId} = req.body || {}; 
    if (!title || !description || !duration || !instructorId) {
        return res.status(400).json({error: 'title, description, duration, and instructorId are required'});
    }

    try {
        // Verify instructor exists (optional, but good practice)
        const instructor = await User.findById(instructorId);
        if (!instructor) return res.status(404).json({error: 'Instructor not found'});

        const newCourse = new Course({ 
            title, 
            description, 
            duration, 
            instructor: instructorId 
        });
        await newCourse.save();

        res.status(201).json({course: newCourse});
    } catch (err) {
        console.error("Create Course Error:", err);
        res.status(500).json({error: 'internal_server_error'});
    }
});

app.use((err, req, res, next) => {
    console.error(err && err.stack ? err.stack : err);
    res.status(500).json({error: 'internal_server_error'});
});

app.listen(PORT, () => {
    console.log(`LMS backend listening on port ${PORT}`);
});

module.exports = app;
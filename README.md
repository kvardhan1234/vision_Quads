# 🎓 LearnHub - Learning Management System

## 📋 Overview
LearnHub is a comprehensive Learning Management System built with modern web technologies, featuring role-based access for students and teachers, course management, assignment submission, grading, and event scheduling.

## ✨ Features Implemented

### 🔐 Authentication System
- **Role-based Registration** (Student / Teacher)
  - Students: Name, Email, Roll Number, Password
  - Teachers: Name, Email, Teacher ID, Password
- **Flexible Login Options**
  - Students: Login with Email OR Roll Number
  - Teachers: Login with Email
- **Session Management** with localStorage

### 👨‍🎓 Student Features
1. **Course Enrollment**
   - Browse all available courses
   - Enroll in courses with one click
   - View enrolled courses with expandable details

2. **Course Materials Access**
   - View uploaded course materials (PPT, PDF, DOC)
   - Download course files
   - Access materials after enrollment

3. **Assignment Submission**
   - Upload assignments for courses with enabled submissions
   - Supports multiple file formats
   - Track submission status

4. **Grades Viewing**
   - View marks on course cards after grading
   - See feedback from teachers

5. **Events Dashboard**
   - View upcoming events
   - See event descriptions and dates
   - Filter by related courses

### 👨‍🏫 Teacher Features
1. **Course Creation**
   - Create courses with title, description, duration
   - Set deadlines for courses
   - Upload multiple course materials (PPT, PDF, DOC, DOCX)
   - Enable/disable assignment submissions

2. **Course Management**
   - View all created courses
   - See enrollment statistics
   - Track student engagement

3. **Assignment Grading**
   - View all submitted assignments across courses
   - Download student submissions
   - Assign marks and provide feedback
   - Update grades with real-time sync

4. **Event Management**
   - Create events with title, description, and date
   - Link events to specific courses
   - Manage academic calendar

## 🛠️ Technical Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: bcrypt for password hashing
- **File Upload**: Multer middleware
- **API**: RESTful architecture
- **CORS**: Enabled for frontend-backend communication

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: Modern CSS with gradients and animations
- **State Management**: React Hooks (useState, useEffect)

### Database Schema
- **Users** (Teachers)
- **Students**
- **Courses**
- **Enrollments** (Junction table)
- **Assignment Submissions**
- **Events**

## 🎨 Design Features

### Modern UI/UX
- **Gradient Backgrounds**: Purple and blue color schemes
- **Glass morphism Effects**: Frosted glass card designs
- **Smooth Animations**:
  - Hover effects on cards
  - Slide-down animations for expanded content
  - Pulse animations for grades
  - Ripple effects on buttons

### Responsive Components
- Grid layouts for courses and submissions
- Expandable course cards
- Sticky navigation header
- Loading spinners with animations

### Color Palette
- Primary: Purple gradient (#667eea to #764ba2)
- Success: Green gradient (#11998e to #38ef7d)
- Warning: Yellow gradient (for assignments)
- Background: Subtle light blues and grays

## 📡 API Endpoints

### Authentication
```
POST /api/register              - Register teacher
POST /api/register-student      - Register student
POST /api/login                 - Teacher login
POST /api/login-student         - Student login (email or rollNo)
```

### Courses
```
GET  /api/courses                          - Get all courses
GET  /api/courses/instructor/:instructorId - Get teacher's courses
POST /api/courses                          - Create new course (with files)
POST /api/courses/:courseId/enroll         - Enroll in course
GET  /api/students/:studentId/courses      - Get student's enrolled courses
```

### Assignments
```
POST /api/assignments/submit                   - Submit assignment
GET  /api/courses/:courseId/submissions        - Get course submissions
GET  /api/teacher/:teacherId/submissions       - Get all teacher submissions
PUT  /api/assignments/:submissionId/grade      - Grade assignment
```

### Events
```
GET  /api/events        - Get all events
POST /api/events        - Create new event
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MySQL (via XAMPP or standalone)
- Git

### Installation

1. **Clone the repository**
```bash
cd LMS-Hackathon
```

2. **Backend Setup**
```bash
cd lms-backend
npm install
```

3. **Configure Environment Variables**
Create `.env` file in `lms-backend`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=lms_database
DB_USER=root
DB_PASSWORD=
PORT=5000
```

4. **Start MySQL Server**
- Open XAMPP Control Panel
- Start MySQL module

5. **Start Backend Server**
```bash
node server.js
```
Backend will run on: http://localhost:5000

6. **Frontend Setup**
```bash
cd ../lms-portal
npm install
```

7. **Start Frontend**
```bash
npm run dev
```
Frontend will run on: http://localhost:5173 (or next available port)

## 👤 Test Accounts

### Student Account
- **Email**: vardhan@gmail.com
- **Password**: pass123
- **Roll Number**: STU001

### Teacher Account
- **Email**: vardhan1@gmail.com
- **Password**: pass123
- **Teacher ID**: TCH001

## 📂 Project Structure

```
LMS-Hackathon/
├── lms-backend/
│   ├── config/
│   │   └── database.js          # Sequelize configuration
│   ├── models/
│   │   ├── User.sequelize.js
│   │   ├── Student.sequelize.js
│   │   ├── Course.sequelize.js
│   │   ├── Enrollment.sequelize.js
│   │   ├── Event.sequelize.js
│   │   ├── AssignmentSubmission.sequelize.js
│   │   └── index.js             # Model relationships
│   ├── uploads/                 # File upload directory
│   ├── server.js                # Main Express app
│   ├── .env                     # Environment variables
│   └── package.json
│
└── lms-portal/
    ├── src/
    │   ├── components/
    │   │   ├── LoginPage.jsx
    │   │   ├── LoginPage.css
    │   │   ├── StudentLoginPage.jsx
    │   │   ├── RegistrationForm.jsx
    │   │   ├── RegistrationForm.css
    │   │   ├── StudentDashboard.jsx
    │   │   ├── TeacherDashboard.jsx
    │   │   ├── CreateCourse.jsx
    │   │   └── Dashboard.css        # Unified styling
    │   ├── App.jsx                   # Main routing
    │   └── index.css
    └── package.json
```

## 🔄 Workflow

### Student Workflow
1. Register/Login as Student
2. Browse available courses
3. Enroll in courses
4. Access course materials
5. Submit assignments
6. View grades and feedback
7. Check upcoming events

### Teacher Workflow
1. Register/Login as Teacher
2. Create new courses with materials
3. Enable assignment submissions
4. View enrolled students
5. Review submitted assignments
6. Grade assignments with feedback
7. Create events for students

## 🎯 Key Features Highlights

### Security
- Password hashing with bcrypt
- Input validation on both frontend and backend
- SQL injection prevention with Sequelize ORM
- CORS configuration for secure API access

### Performance
- Efficient database queries with Sequelize
- Optimized file upload handling
- Lazy loading with React
- CSS animations using GPU acceleration

### User Experience
- Intuitive navigation
- Real-time feedback messages
- Loading states for async operations
- Error handling with user-friendly messages
- Responsive design for all screen sizes

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Frontend automatically tries next available port
   - Check backend is running on port 5000

2. **Database Connection Error**
   - Ensure MySQL is running in XAMPP
   - Verify database credentials in .env

3. **File Upload Issues**
   - Check uploads directory exists
   - Verify file size limits (10MB max)

4. **CORS Errors**
   - Ensure frontend and backend ports match configuration
   - Check CORS settings in server.js

## 🔮 Future Enhancements

- Real-time notifications
- Video conferencing integration
- Quiz and exam module
- Discussion forums
- Analytics dashboard
- Email notifications
- Mobile app version
- Role-based permissions refinement

## 📝 License
This project is created for educational purposes.

## 👥 Contributors
- Vardhan (Full Stack Development)

---

**Built with ❤️ using React, Node.js, Express, and MySQL**

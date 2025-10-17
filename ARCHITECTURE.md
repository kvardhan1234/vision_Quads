# LearnHub System Architecture & Flows

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│                      Port: 5173/5174                            │
├─────────────────────────────────────────────────────────────────┤
│  Components:                                                     │
│  ├── LoginPage (Teacher/Admin)                                  │
│  ├── StudentLoginPage (Student)                                 │
│  ├── RegistrationForm (Role-based)                              │
│  ├── TeacherDashboard                                           │
│  ├── StudentDashboard                                           │
│  ├── CreateCourse                                               │
│  └── SubmittedAssignments (embedded in TeacherDashboard)        │
└─────────────────────────────────────────────────────────────────┘
                              ↕️ HTTP/REST API
┌─────────────────────────────────────────────────────────────────┐
│                      Backend (Node.js/Express)                   │
│                         Port: 5000                               │
├─────────────────────────────────────────────────────────────────┤
│  API Endpoints:                                                  │
│  ├── /api/register                                              │
│  ├── /api/register-student                                      │
│  ├── /api/login                                                 │
│  ├── /api/login-student                                         │
│  ├── /api/courses                                               │
│  ├── /api/courses/:courseId/enroll                              │
│  ├── /api/events                                                │
│  ├── /api/assignments/submit                                    │
│  └── /api/assignments/:id/grade                                 │
├─────────────────────────────────────────────────────────────────┤
│  Middleware:                                                     │
│  ├── CORS                                                       │
│  ├── Body Parser (JSON)                                         │
│  └── Multer (File Upload)                                       │
└─────────────────────────────────────────────────────────────────┘
                              ↕️ Mongoose ODM
┌─────────────────────────────────────────────────────────────────┐
│                      Database (MongoDB)                          │
│                         Port: 27017                              │
├─────────────────────────────────────────────────────────────────┤
│  Collections:                                                    │
│  ├── users (Teachers/Admins)                                    │
│  ├── students                                                   │
│  ├── courses                                                    │
│  ├── events                                                     │
│  └── assignmentsubmissions                                      │
└─────────────────────────────────────────────────────────────────┘
```

## User Registration Flow

### Student Registration
```
User → Registration Form
  ↓
  Selects "Student" role
  ↓
  Fills in:
  ├── Full Name
  ├── Email
  ├── Roll Number ⭐
  ├── Password
  └── Confirm Password
  ↓
  Validates inputs
  ↓
  POST /api/register-student
  ↓
  Backend validates:
  ├── Check unique email
  ├── Check unique roll number
  └── Hash password
  ↓
  Save to students collection
  ↓
  Redirect to Student Login
```

### Teacher Registration
```
User → Registration Form
  ↓
  Selects "Teacher" role
  ↓
  Fills in:
  ├── Full Name
  ├── Email
  ├── Teacher ID ⭐
  ├── Password
  └── Confirm Password
  ↓
  Validates inputs
  ↓
  POST /api/register
  ↓
  Backend validates:
  ├── Check unique email
  └── Hash password
  ↓
  Save to users collection
  ↓
  Redirect to Teacher Login
```

## Login Flow

### Student Login
```
Student → Student Login Page
  ↓
  Enters:
  ├── Email OR Roll Number ⭐
  └── Password
  ↓
  POST /api/login-student
  ↓
  Backend:
  ├── Find by email OR rollNo
  ├── Compare password hash
  └── Return student data
  ↓
  Store in localStorage:
  ├── user data
  ├── role: "Student"
  └── isLoggedIn: true
  ↓
  Navigate to /student-dashboard
```

### Teacher Login
```
Teacher → Admin/Staff Login Page
  ↓
  Enters:
  ├── Email
  └── Password
  ↓
  POST /api/login
  ↓
  Backend:
  ├── Find by email
  ├── Compare password hash
  └── Return user data
  ↓
  Store in localStorage:
  ├── user data
  ├── role: "Teacher"
  └── isLoggedIn: true
  ↓
  Navigate to /teacher-dashboard
```

## Course Creation Flow (Teacher)

```
Teacher Dashboard
  ↓
  Clicks "+ Create Course"
  ↓
  Create Course Form:
  ├── Title ⭐
  ├── Description ⭐
  ├── Duration
  ├── Deadline
  ├── Upload Files (PPT/PDF) ⭐
  └── Enable Assignment ☑️ ⭐
  ↓
  FormData preparation
  ↓
  POST /api/courses (multipart/form-data)
  ↓
  Backend:
  ├── Verify instructor exists
  ├── Save uploaded files to /uploads
  ├── Create course document:
  │   ├── Basic info
  │   ├── File paths
  │   ├── assignmentEnabled flag
  │   └── Empty enrollments array
  └── Save to database
  ↓
  Populate instructor details
  ↓
  Return course data
  ↓
  Redirect to Teacher Dashboard
  ↓
  Course visible to all students
```

## Course Enrollment Flow (Student)

```
Student Dashboard
  ↓
  Views available courses
  ↓
  Course card shows:
  ├── Title
  ├── Description
  ├── Instructor
  ├── Deadline
  └── "Enroll" button
  ↓
  Student clicks "Enroll"
  ↓
  POST /api/courses/:courseId/enroll
  ↓
  Backend:
  ├── Check if already enrolled
  ├── Add to course.enrollments[]
  ├── Add to student.enrolledCourses[]
  └── Save both documents
  ↓
  Return updated course
  ↓
  Frontend:
  ├── Course card expands ⭐
  ├── Shows course materials
  ├── Shows assignment section
  └── Shows marks (if graded)
```

## Assignment Submission Flow

```
Student (enrolled in course)
  ↓
  Views expanded course card
  ↓
  If assignmentEnabled:
    Shows "Submit Assignment" button
  ↓
  Student clicks button
  ↓
  File picker opens
  ↓
  Student selects file
  ↓
  FormData preparation:
  ├── assignmentFile
  ├── courseId
  ├── studentId
  ├── studentName
  └── studentRollNo
  ↓
  POST /api/assignments/submit
  ↓
  Backend:
  ├── Check course exists
  ├── Check assignment enabled
  ├── Check not already submitted
  ├── Save file to /uploads
  └── Create submission document
  ↓
  Success message
  ↓
  Submission appears in teacher's view
```

## Assignment Grading Flow

```
Teacher Dashboard
  ↓
  Clicks "Submitted Assignments" tab
  ↓
  GET /api/teacher/:teacherId/submissions
  ↓
  Backend:
  ├── Find all teacher's courses
  ├── Find submissions for those courses
  └── Populate student & course details
  ↓
  Display submissions:
  ├── Student name
  ├── Roll number
  ├── Course title
  ├── Submission date
  ├── Download link
  └── Grade form
  ↓
  Teacher enters:
  ├── Marks ⭐
  └── Feedback (optional)
  ↓
  Clicks "Grade"
  ↓
  PUT /api/assignments/:submissionId/grade
  ↓
  Backend:
  ├── Update submission.marks
  ├── Update submission.feedback
  ├── Find student document
  ├── Update student.enrolledCourses[].marks ⭐
  └── Save both documents
  ↓
  Return updated submission
  ↓
  Frontend shows success
  ↓
  Student sees marks on course card ⭐
```

## Event Creation Flow

```
Teacher Dashboard
  ↓
  Clicks "+ Create Event"
  ↓
  Prompt dialogs:
  ├── Event Title
  ├── Event Description
  └── Event Date
  ↓
  POST /api/events
  ↓
  Backend:
  ├── Create event document:
  │   ├── title
  │   ├── description
  │   ├── eventDate
  │   ├── createdBy (teacherId)
  │   └── relatedCourse (optional)
  └── Save to database
  ↓
  Populate creator details
  ↓
  Success message
  ↓
  Event appears in:
  ├── All student dashboards ⭐
  └── Upcoming events section
```

## Data Flow Diagram

### Student View Course Materials
```
Student Dashboard
  ↓
GET /api/courses
  ↓
Backend returns all courses with:
  ├── Basic info
  ├── Instructor details
  ├── Enrollment list
  └── File paths
  ↓
If student enrolled:
  ↓
  Expanded view shows:
  ├── Course files (clickable links)
  ├── Assignment section
  └── Current marks
  ↓
  File link: http://localhost:5000/uploads/filename
  ↓
  File download/view
```

## State Management

### LocalStorage Keys
```javascript
{
  "user": "{...student/teacher data...}",
  "role": "Student" | "Teacher" | "Admin",
  "isLoggedIn": "true" | "false"
}
```

### Component State (Student Dashboard)
```javascript
{
  student: {...},           // Current student data
  courses: [...],           // All available courses
  events: [...],            // Upcoming events
  expandedCourse: "id",     // Which course card is expanded
  loading: boolean
}
```

### Component State (Teacher Dashboard)
```javascript
{
  teacher: {...},           // Current teacher data
  courses: [...],           // Teacher's courses
  view: "home" | "submissions",
  loading: boolean
}
```

## Key Features Highlighted ⭐

1. **Role-based Registration**: Different fields for students (rollNo) vs teachers (teacherId)
2. **Flexible Login**: Students can use email OR roll number
3. **Expandable Course Cards**: Cards expand after enrollment to show materials
4. **File Upload**: Support for course materials and assignment submissions
5. **Assignment Toggle**: Teachers control if assignments are enabled per course
6. **Automatic Grade Sync**: Marks update on student course cards when graded
7. **Event System**: Teachers create events visible to all students
8. **Enrollment Tracking**: Teachers see enrollment counts per course
9. **Submission Management**: Dedicated interface for reviewing assignments
10. **Material Access Control**: Files only visible after enrollment

## Security Measures

```
Password Security:
  ├── Bcrypt hashing (10 salt rounds)
  ├── Never store plain text
  └── Never return hashed password in responses

Data Validation:
  ├── Frontend: Required fields, format checks
  └── Backend: Schema validation, unique constraints

Access Control:
  ├── Student-only routes
  ├── Teacher-only routes
  └── Role-based redirects

File Upload Security:
  ├── File size limit: 10MB
  ├── File type validation
  └── Unique filename generation
```

## Database Relationships

```
User (Teacher) ←─── Course ←─── Enrollment ───→ Student
       ↓                ↓              ↓
    Event        Assignment      Student.enrolledCourses
                 Submission           (with marks)
```

---

This architecture ensures a smooth, secure, and feature-rich learning management experience!

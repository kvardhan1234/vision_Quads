# Quick Start Guide - LearnHub

## 🚀 Starting the Application

### 1. Start MongoDB
Make sure MongoDB is running on your system:
```bash
mongod
```

### 2. Start the Backend Server
```bash
cd LMS-Hackathon/lms-backend
npm start
```
✅ Backend running at: http://localhost:5000

### 3. Start the Frontend
Open a new terminal:
```bash
cd LMS-Hackathon/lms-portal
npm run dev
```
✅ Frontend running at: http://localhost:5173 or 5174

### 4. Access the Application
Click the preview button to open the LearnHub portal!

---

## 👨‍🎓 Student Demo Flow

### Step 1: Register as Student
1. Click "Register" or navigate to registration page
2. Select **"Student"** as role
3. Fill in:
   - Full Name: `John Doe`
   - Email: `john@student.com`
   - Roll Number: `STU001`
   - Password: `student123`
   - Confirm Password: `student123`
4. Click "Create your account"

### Step 2: Login as Student
1. Go to Student Login page
2. Enter: `STU001` or `john@student.com`
3. Enter password: `student123`
4. Click "Login"

### Step 3: View Courses
- You'll see all courses created by teachers
- Each card shows course details
- Click "Enroll" to join a course

### Step 4: After Enrollment
- Course card expands
- View course materials (PDFs, PPTs)
- Submit assignments if enabled
- View your marks when graded

---

## 👨‍🏫 Teacher Demo Flow

### Step 1: Register as Teacher
1. Go to registration page
2. Select **"Teacher"** as role
3. Fill in:
   - Full Name: `Dr. Smith`
   - Email: `smith@teacher.com`
   - Teacher ID: `TCH001`
   - Password: `teacher123`
   - Confirm Password: `teacher123`
4. Click "Create your account"

### Step 2: Login as Teacher
1. Go to Admin/Staff Login page
2. Enter: `smith@teacher.com`
3. Enter password: `teacher123`
4. Click "Login"

### Step 3: Create a Course
1. Click **"+ Create Course"** button
2. Fill in course details:
   - Title: `Introduction to Web Development`
   - Description: `Learn HTML, CSS, and JavaScript basics`
   - Duration: `6 Weeks`
   - Deadline: Select a future date
3. Upload course materials (optional):
   - Click "Choose Files"
   - Select PDF or PPT files
4. Check **"Enable Assignment Submission"** if you want students to submit assignments
5. Click "Create Course"

### Step 4: Create an Event
1. Click **"+ Create Event"** button
2. Enter:
   - Event Title: `Midterm Exam`
   - Description: `Covers chapters 1-5`
   - Event Date: Select date
3. Event will appear on all student dashboards

### Step 5: View Submitted Assignments
1. Click **"Submitted Assignments"** tab
2. See all student submissions
3. Click to view/download assignment files

### Step 6: Grade Assignments
1. Enter marks (e.g., `85`)
2. Add optional feedback: `Good work!`
3. Click "Grade"
4. Marks automatically appear on student's course card

---

## 🎯 Testing Complete Workflow

### Scenario: Complete Course Lifecycle

1. **Teacher creates course** with assignment enabled
2. **Student logs in** and sees the new course
3. **Student enrolls** in the course
4. **Course card expands** showing materials and assignment option
5. **Student submits** an assignment file
6. **Teacher views submission** in "Submitted Assignments"
7. **Teacher grades** the submission
8. **Student sees marks** on their course card

---

## 📁 Sample Files for Testing

You can create sample files to test uploads:

### Course Materials:
- Create a simple PDF with course content
- Create a PowerPoint presentation

### Assignment Submissions:
- Create a text file or Word document
- Name it something like "Assignment1_STU001.pdf"

---

## 🔑 Test Accounts

### Student Account
- **Email/Roll**: `john@student.com` or `STU001`
- **Password**: `student123`

### Teacher Account
- **Email**: `smith@teacher.com`
- **Password**: `teacher123`

---

## ⚡ Quick Commands

### Reset Everything:
```bash
# Stop backend (Ctrl+C)
# Stop frontend (Ctrl+C)
# Restart MongoDB
mongod --dbpath /your/db/path

# Clear uploads (optional)
cd LMS-Hackathon/lms-backend
rm -rf uploads/*
mkdir uploads
```

### View Logs:
Backend logs show in the terminal where you ran `npm start`

---

## 🐛 Common Issues

**Problem**: Cannot connect to backend
- **Solution**: Check backend is running on port 5000

**Problem**: MongoDB connection error
- **Solution**: Ensure MongoDB is running with `mongod`

**Problem**: File upload fails
- **Solution**: Check file size is under 10MB

**Problem**: Login fails
- **Solution**: Verify credentials or register a new account

---

## 🎨 Features to Try

✅ Role-based registration (Student vs Teacher)  
✅ Flexible student login (email OR roll number)  
✅ Course creation with file uploads  
✅ Course enrollment system  
✅ Expandable course cards  
✅ Assignment submission & grading  
✅ Event creation and viewing  
✅ Marks display on student dashboard  
✅ Teacher submission management  

---

## 📞 Support

For issues or questions about the LearnHub system, please check:
1. README.md - Full documentation
2. Backend logs - Error messages
3. Browser console - Frontend errors

---

**Enjoy using LearnHub!** 🎓

# Student Dashboard Debug Guide

## Issue
Student login succeeds but dashboard doesn't show or redirects back to login.

## Debugging Steps

### 1. Open Browser Console
Press `F12` to open Developer Tools, then go to the **Console** tab.

### 2. Clear Everything
```javascript
// Run this in the console to start fresh:
localStorage.clear();
```

### 3. Try Logging In
Use the Student Login with:
- **Email**: `vardhan@gmail.com` OR **Roll Number**: `STU001`
- **Password**: `pass123`

### 4. Watch the Console Logs

You should see this sequence:

```
✅ Attempting Student Login with: {identifier: "vardhan@gmail.com", password: "pass123"}
✅ Student login response: {student: {...}}
✅ Student data stored in localStorage: {id: 1, name: "Vardhan", ...}
✅ Redirecting to /student-dashboard in 1.5 seconds...
✅ Navigating now to /student-dashboard
📚 StudentDashboard mounted
👤 User data from localStorage: {"id":1,"name":"Vardhan",...}
✅ Parsed user: {id: 1, name: "Vardhan", ...}
```

### 5. If You See This Instead:
```
❌ No user data found, redirecting to login
```

**This means:** localStorage was cleared or not set properly.

### 6. Manual Check
Open the **Application** tab in DevTools:
- Go to: Storage → Local Storage → http://localhost:5175
- Check if these keys exist:
  - `user` (should have JSON student data)
  - `role` (should be "Student")
  - `isLoggedIn` (should be "true")

## Common Issues & Fixes

### Issue 1: Page Redirects Immediately
**Symptom:** Logs show no user data  
**Fix:** Clear browser cache and localStorage, try again

### Issue 2: Page Stays on Login
**Symptom:** No redirect happens  
**Fix:** Check browser console for navigation errors

### Issue 3: White/Blank Dashboard
**Symptom:** URL changes to /student-dashboard but page is blank  
**Fix:** Check for CSS or component errors in console

### Issue 4: API Errors
**Symptom:** "Failed to fetch" errors  
**Fix:** Ensure backend is running on port 5000

## Backend Check
Verify backend is running:
```bash
netstat -ano | findstr :5000
```

Should show a process listening on port 5000.

## Frontend Check
Verify frontend is running:
```
Should be on: http://localhost:5175
```

## Test URLs Directly

After logging in successfully, try accessing directly:
- http://localhost:5175/student-dashboard

If this works but redirect doesn't, it's a navigation issue.

## Expected Behavior

### Successful Flow:
1. Enter credentials → Click Login
2. See "Welcome Vardhan! Redirecting to dashboard..."
3. Wait 1.5 seconds
4. Dashboard loads with:
   - Header: "LearnHub - Student Dashboard"
   - Welcome message: "Welcome, Vardhan"
   - Available Courses section
   - Upcoming Events section

### Dashboard Should Show:
- Purple gradient background
- White header with logout button
- Course cards (if any exist)
- Event cards (if any exist)
- Loading spinner initially

## If Everything Else Fails

1. **Hard Refresh**: Ctrl + Shift + R (Windows) or Cmd + Shift + R (Mac)
2. **Clear All Data**: 
   - DevTools → Application → Clear storage → Clear site data
3. **Restart Servers**:
   - Stop backend and frontend
   - Start backend: `node server.js`
   - Start frontend: `npm run dev`

## Log Analysis

Check backend logs (terminal running node server.js):
```
✅ POST /api/login-student (login successful)
✅ GET /api/courses (dashboard loading courses)
✅ GET /api/events (dashboard loading events)
```

If you see these, the dashboard IS loading correctly!

---

**Created:** 2025-10-17  
**Purpose:** Debug student dashboard navigation issue

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import StudentLoginPage from './components/StudentLoginPage';
import RegistrationForm from './components/RegistrationForm';
import CreateCourse from './components/CreateCourse'; 
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Entry Points */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} /> 
        <Route path="/login/student" element={<StudentLoginPage />} /> 
        <Route path="/register" element={<RegistrationForm />} />
        
        {/* Teacher Routes */}
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} /> 
        <Route path="/create-course" element={<CreateCourse />} /> 
        
        {/* Student Routes */}
        <Route path="/student-dashboard" element={<StudentDashboard />} /> 
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

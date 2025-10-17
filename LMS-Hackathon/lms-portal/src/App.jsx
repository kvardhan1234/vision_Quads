import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import LoginPage from './components/LoginPage'; 
import StudentLoginPage from './components/StudentLoginPage';
import CreateCourse from './components/CreateCourse';

function App() {
  return (
    <Router>
      <Routes>
        {/* CORRECTED ENTRY POINT: The root path (/) should show Registration */}
        <Route path="/" element={<RegistrationForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        
        {/* Login Page */}
        <Route path="/login" element={<LoginPage />} />
  {/* Student Login Page */}
  <Route path="/login/student" element={<StudentLoginPage />} />
        
        {/* Dashboard Placeholder (for teacher/admin access after login) */}
        <Route path="/dashboard" element={<CreateCourse />} />

        {/* You could also add a 404 handler for unknown routes */}
        {/* <Route path="*" element={<h1>404 Not Found</h1>} /> */}
      </Routes>
    </Router>
  );
}

export default App;

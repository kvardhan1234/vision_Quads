import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Reusing the same CSS for consistency

const StudentLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: '', // Can be email or rollNo
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
        console.log('Attempting Student Login with:', formData);
        
        // Directly call the student login endpoint
        const resp = await fetch('http://localhost:5000/api/login-student', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: formData.identifier, password: formData.password }),
        });

        if (!resp.ok) {
          const errorBody = await resp.json().catch(() => ({}));
          throw new Error(errorBody.error || 'Student login failed');
        }

        const data = await resp.json();
        console.log('✅ Student login response:', data);
        
        // Store student info in localStorage
        if (data.student) {
          localStorage.setItem('user', JSON.stringify(data.student));
          localStorage.setItem('role', 'Student');
          localStorage.setItem('isLoggedIn', 'true');
          console.log('✅ Student data stored in localStorage:', data.student);
        } else {
          throw new Error('Invalid response from server. Missing student data.');
        }

        setMessage(`Welcome ${data.student.name}! Redirecting to dashboard...`);
        console.log('✅ Redirecting to /student-dashboard in 1.5 seconds...');
        
        // Redirect to Student Dashboard
        setTimeout(() => {
            console.log('✅ Navigating now to /student-dashboard');
            navigate('/student-dashboard'); 
        }, 1500); 

    } catch (error) {
        console.error('Student Login Error:', error.message);
        setMessage(`Error: ${error.message}`);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        
        <h2 className="login-title">Student Login</h2> 
        
        <div className="student-login-prompt">
          Are you a teacher? 
          <a href="/login" className="student-login-link">Login here</a>
        </div>

        {message && (
            <div className={`message ${message.includes('Welcome') ? 'message-success' : 'message-error'}`}>
                {message}
            </div>
        )}

        <form onSubmit={handleSubmit} className="login-form-content">
          
          <div className="form-group">
            <label htmlFor="identifier">Email or Roll Number</label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Email or Roll Number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Password"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn login-btn-primary"
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>

        <div className="login-link">
          Don't have an account? <a className="link-secondary" href="/register">Register here</a>
        </div>
      </div>
    </div>
  );
};

export default StudentLoginPage;

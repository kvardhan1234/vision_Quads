import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginStudent } from '../utils/api.js';
import './LoginPage.css'; // Reusing the same CSS for consistency

const StudentLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
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
        
  // Call the separate student login API
  await loginStudent(formData);

        setMessage(`Welcome Student! Redirecting to dashboard...`);
        
        // Redirect to dashboard after a successful login
        setTimeout(() => {
            navigate('/dashboard'); 
        }, 1000); 

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
      Are you Admin/Staff? 
      {/* Link back to the Admin/Staff login page */}
      <a href="/login" className="student-login-link">Login here</a> 
    </div>

        {message && (
            <div className={`message ${message.includes('Welcome') ? 'message-success' : 'message-error'}`}>
                {message}
            </div>
        )}

        <form onSubmit={handleSubmit} className="login-form-content">
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Student Email"
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
          
          {/* Removing forgot password/activation link for a simpler student view */}

          <button
            type="submit"
            disabled={loading}
            className="btn login-btn-primary"
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default StudentLoginPage;

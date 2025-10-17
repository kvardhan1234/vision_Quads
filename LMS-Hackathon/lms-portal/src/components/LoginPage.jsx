import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// CHANGED: Explicitly specify the .js extension for the import
import { loginUser } from '../utils/api.js'; 
import './LoginPage.css';

const LoginPage = () => {
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

  // CORRECTED: Using the loginUser API function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
        console.log('Attempting Login with:', formData);
        
        // Call the API utility to handle login (sends data to backend or uses mock logic)
        const response = await loginUser(formData);

        // Assuming response contains user details or a token
        const role = response.user?.role || 'User'; 
        setMessage(`Login successful as ${role}! Redirecting to dashboard...`);
        
        // Store user data (e.g., in session storage) and redirect
        // For the hackathon, a simple redirect is fine
        setTimeout(() => {
            navigate('/dashboard'); 
        }, 1000); 

    } catch (error) {
        // Display user-friendly error message from the API call
        console.error('Login Error:', error.message);
        setMessage(`Error: ${error.message}`);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        
        <h2 className="login-title">Admin/Staff Login</h2> 
        
    <div className="student-login-prompt">
      Are you a student? 
      {/* Students should use the student login portal */}
      <a href="/login/student" className="student-login-link">Login here</a>
    </div>

        {/* Message Display (Success/Error) */}
        {message && (
            <div className={`message ${message.includes('successful') ? 'message-success' : 'message-error'}`}>
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
              placeholder="Email"
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

          <div className="password-links">
            <a href="/forgot-password" className="forgot-password-link">Forgot Password?</a>
            <a href="/activation-link" className="activation-link">Get Activation Link</a>
          </div>

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

export default LoginPage;

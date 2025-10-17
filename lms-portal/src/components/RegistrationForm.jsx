import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegistrationForm.css';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Student',
    rollNo: '', // For students
    teacherId: '' // For teachers
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
    setMessage('');

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.password) {
      setMessage('Please fill all required fields.');
      return;
    }

    if (!formData.role) {
      setMessage('Please select a role.');
      return;
    }

    // Role-specific validation
    if (formData.role === 'Student' && !formData.rollNo) {
      setMessage('Please enter your roll number.');
      return;
    }

    if (formData.role === 'Teacher' && !formData.teacherId) {
      setMessage('Please enter your teacher ID.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const endpoint = formData.role === 'Student' ? '/api/register-student' : '/api/register';
      
      const payload = formData.role === 'Student' 
        ? { name: formData.fullName, email: formData.email, password: formData.password, rollNo: formData.rollNo }
        : { name: formData.fullName, email: formData.email, password: formData.password, role: formData.role, teacherId: formData.teacherId };
      
      console.log('Registering with payload:', payload);
      console.log('Endpoint:', `http://localhost:5000${endpoint}`);
      
      const resp = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      console.log('Response status:', resp.status);

      if (!resp.ok) {
        const errBody = await resp.json().catch(() => ({}));
        console.log('Error response:', errBody);
        throw new Error(errBody.error || `Registration failed (${resp.status})`); 
      }

      await resp.json().catch(() => null);
      setMessage(`Registration successful as ${formData.role}! Redirecting to login...`);

      setTimeout(() => navigate(formData.role === 'Student' ? '/login/student' : '/login'), 1500);
    } catch (err) {
      console.error('Registration error:', err);
      setMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-page-container">
      <div className="registration-card">
        {/* CORRECTION 1: Change "Create your account" to "LMS Portal" */}
        <h2 className="card-title">LMS Portal</h2> 

        {message && (
          <div className={`message ${message.includes('successful') ? 'message-success' : 'message-error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-content">
          <div className="form-group">
            <label htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="form-input"
              placeholder="Your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-input form-select"
            >
              <option>Student</option>
              <option>Teacher</option>
            </select>
          </div>

          {/* Conditional fields based on role */}
          {formData.role === 'Student' && (
            <div className="form-group">
              <label htmlFor="rollNo">Roll Number</label>
              <input
                id="rollNo"
                name="rollNo"
                value={formData.rollNo}
                onChange={handleChange}
                className="form-input"
                placeholder="Your roll number"
                required
              />
            </div>
          )}

          {formData.role === 'Teacher' && (
            <div className="form-group">
              <label htmlFor="teacherId">Teacher ID</label>
              <input
                id="teacherId"
                name="teacherId"
                value={formData.teacherId}
                onChange={handleChange}
                className="form-input"
                placeholder="Your teacher ID"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="example@domain.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-input"
              placeholder="Repeat password"
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Registering…' : 'Create your account'}
          </button>
        </form>

        <div className="login-link">
          Already have an account? <a className="link-secondary" href="/login">Login here</a>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
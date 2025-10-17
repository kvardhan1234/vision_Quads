import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const CreateCourse = () => {
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    duration: '',
    deadline: '',
    instructorId: '',
    assignmentEnabled: false
  });
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && (user.id || user._id)) {
      setCourseData(prev => ({ ...prev, instructorId: user.id || user._id }));
    } else {
      setMessage("Error: Instructor not logged in. Please log in as a teacher.");
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCourseData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!courseData.instructorId) {
      setMessage("Error: Instructor ID is missing. Cannot create course.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', courseData.title);
      formData.append('description', courseData.description);
      formData.append('duration', courseData.duration);
      formData.append('deadline', courseData.deadline);
      formData.append('instructorId', courseData.instructorId);
      formData.append('assignmentEnabled', courseData.assignmentEnabled);
      
      // Append files
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create course');
      }

      setMessage('Course created successfully!');
      
      setTimeout(() => {
        navigate('/teacher-dashboard');
      }, 1500);
      
    } catch (error) {
      console.error('Course creation failed:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div style={{ 
        maxWidth: '700px', 
        margin: '50px auto', 
        padding: '30px', 
        backgroundColor: 'white',
        borderRadius: '10px', 
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '10px', color: '#333' }}>Create New Course</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
          Fill in the details to create a new course for your students.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
              Course Title *
            </label>
            <input
              type="text"
              name="title"
              value={courseData.title}
              onChange={handleChange}
              placeholder="e.g., Introduction to Web Development"
              required
              className="form-input"
              style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
              Description *
            </label>
            <textarea
              name="description"
              value={courseData.description}
              onChange={handleChange}
              placeholder="Provide a detailed course summary"
              required
              rows="5"
              className="form-input"
              style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px', resize: 'vertical' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
              Duration
            </label>
            <input
              type="text"
              name="duration"
              value={courseData.duration}
              onChange={handleChange}
              placeholder="e.g., 6 Weeks, Self-Paced"
              className="form-input"
              style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
              Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={courseData.deadline}
              onChange={handleChange}
              className="form-input"
              style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
              Upload Course Materials (PPT, PDF, etc.)
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              accept=".pdf,.ppt,.pptx,.doc,.docx"
              className="form-input"
              style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '6px' }}
            />
            {files.length > 0 && (
              <p style={{ marginTop: '8px', color: '#555', fontSize: '0.9em' }}>
                {files.length} file(s) selected
              </p>
            )}
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="assignmentEnabled"
                checked={courseData.assignmentEnabled}
                onChange={handleChange}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <span style={{ fontWeight: 'bold', color: '#555' }}>
                Enable Assignment Submission for this course
              </span>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary"
            style={{ 
              width: '100%', 
              padding: '15px', 
              fontSize: '1.1em',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Creating...' : 'Create Course'}
          </button>
        </form>
        
        {message && (
          <p style={{ 
            textAlign: 'center', 
            marginTop: '20px', 
            padding: '10px',
            borderRadius: '4px',
            backgroundColor: message.includes('Error') ? '#f8d7da' : '#d4edda',
            color: message.includes('Error') ? '#721c24' : '#155724'
          }}>
            {message}
          </p>
        )}

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button 
            onClick={() => navigate('/teacher-dashboard')} 
            className="btn btn-secondary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
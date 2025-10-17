import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const [courses, setCourses] = useState([]);
  const [view, setView] = useState('home'); // 'home' or 'submissions'
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setTeacher(parsedUser);
    fetchTeacherCourses(parsedUser.id || parsedUser._id);
    
    // Auto-refresh courses every 10 seconds when on home view
    const interval = setInterval(() => {
      if (view === 'home' && parsedUser) {
        fetchTeacherCourses(parsedUser.id || parsedUser._id, true); // silent refresh
      }
    }, 10000); // 10 seconds
    
    return () => clearInterval(interval); // Cleanup on unmount
  }, [navigate, view]);

  const fetchTeacherCourses = async (instructorId, silent = false) => {
    try {
      const response = await fetch(`http://localhost:5000/api/courses/instructor/${instructorId}`);
      const data = await response.json();
      setCourses(data.courses || []);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleCreateEvent = async () => {
    const title = prompt('Event Title:');
    if (!title) return;

    const description = prompt('Event Description:');
    if (!description) return;

    const eventDate = prompt('Event Date (YYYY-MM-DD):');
    if (!eventDate) return;

    try {
      const resp = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          eventDate,
          createdBy: teacher.id || teacher._id
        })
      });

      if (resp.ok) {
        alert('Event created successfully!');
      } else {
        alert('Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>LearnHub - Teacher Dashboard</h1>
        <div className="header-actions">
          <span className="user-name">Welcome, {teacher?.name}</span>
          <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="teacher-nav">
          <button 
            onClick={() => setView('home')} 
            className={`btn ${view === 'home' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Home
          </button>
          <button 
            onClick={() => setView('submissions')} 
            className={`btn ${view === 'submissions' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Submitted Assignments
          </button>
        </div>

        {view === 'home' && (
          <section className="courses-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Your Courses</h2>
              <div>
                <button 
                  onClick={() => navigate('/create-course')} 
                  className="btn btn-primary"
                  style={{ marginRight: '1rem' }}
                >
                  + Create Course
                </button>
                <button 
                  onClick={handleCreateEvent} 
                  className="btn btn-success"
                >
                  + Create Event
                </button>
              </div>
            </div>

            {courses.length === 0 ? (
              <p className="no-data">You haven't created any courses yet.</p>
            ) : (
              <div className="courses-grid">
                {courses.map((course) => {
                  const courseId = course.id || course._id;
                  return (
                    <div key={courseId} className="course-card">
                    <h3>{course.title}</h3>
                    <p className="course-description">{course.description}</p>
                    <p className="course-instructor">Duration: {course.duration}</p>
                    {course.deadline && (
                      <p className="course-deadline">
                        Deadline: {new Date(course.deadline).toLocaleDateString()}
                      </p>
                    )}
                    <p className="course-instructor">
                      Enrollments: {course.enrollments?.length || 0} students
                    </p>
                      <p className="course-instructor">
                        Assignment: {course.assignmentEnabled ? '✅ Enabled' : '❌ Disabled'}
                      </p>
                      {course.files && course.files.length > 0 && (
                        <p className="course-instructor">📎 {course.files.length} file(s) attached</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {view === 'submissions' && (
          <SubmittedAssignments teacherId={teacher?.id || teacher?._id} />
        )}
      </div>
    </div>
  );
};

// Embedded SubmittedAssignments Component
const SubmittedAssignments = ({ teacherId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (teacherId) {
      fetchSubmissions();
    }
  }, [teacherId]);

  const fetchSubmissions = async () => {
    try {
      const resp = await fetch(`http://localhost:5000/api/teacher/${teacherId}/submissions`);
      const data = await resp.json();
      
      // Parse assignmentFile if it's a JSON string
      const parsedSubmissions = (data.submissions || []).map(submission => ({
        ...submission,
        assignmentFile: typeof submission.assignmentFile === 'string' 
          ? JSON.parse(submission.assignmentFile || 'null') 
          : submission.assignmentFile
      }));
      
      setSubmissions(parsedSubmissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGrade = async (submissionId, marks, feedback) => {
    try {
      const resp = await fetch(`http://localhost:5000/api/assignments/${submissionId}/grade`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marks: parseFloat(marks), feedback })
      });

      if (resp.ok) {
        alert('Graded successfully!');
        fetchSubmissions(); // Refresh
      } else {
        alert('Failed to grade submission');
      }
    } catch (error) {
      console.error('Error grading:', error);
      alert('Failed to grade submission');
    }
  };

  if (loading) {
    return <div className="loading">Loading submissions...</div>;
  }

  return (
    <section className="courses-section">
      <h2>Submitted Assignments</h2>
      {submissions.length === 0 ? (
        <p className="no-data">No assignments submitted yet.</p>
      ) : (
        <div className="submissions-grid">
          {submissions.map((submission) => {
            const submissionId = submission.id || submission._id;
            return (
              <div key={submissionId} className={`submission-card ${submission.marks !== null ? 'graded' : ''}`}>
              <h3>{submission.studentName}</h3>
              <div className="submission-info">
                <p><strong>Roll No:</strong> {submission.studentRollNo}</p>
                <p><strong>Course:</strong> {submission.course?.title || submission.courseId?.title || 'N/A'}</p>
                <p><strong>Submitted:</strong> {new Date(submission.submittedAt).toLocaleDateString()}</p>
                {submission.marks !== null && (
                  <p><strong>Marks:</strong> {submission.marks}</p>
                )}
              </div>

              {submission.assignmentFile && submission.assignmentFile.path && (
                <p>
                  <a 
                    href={`http://localhost:5000${submission.assignmentFile.path}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    📄 View Submission
                  </a>
                </p>
              )}

              {submission.feedback && (
                <p><strong>Feedback:</strong> {submission.feedback}</p>
              )}

              <div className="grade-form">
                <input 
                  type="number" 
                  placeholder="Marks" 
                  id={`marks-${submissionId}`}
                  defaultValue={submission.marks || ''}
                />
                <textarea 
                  placeholder="Feedback (optional)" 
                  id={`feedback-${submissionId}`}
                  defaultValue={submission.feedback || ''}
                />
                <button 
                  onClick={() => {
                    const marks = document.getElementById(`marks-${submissionId}`).value;
                    const feedback = document.getElementById(`feedback-${submissionId}`).value;
                    if (!marks) {
                      alert('Please enter marks');
                      return;
                    }
                    handleGrade(submissionId, marks, feedback);
                  }}
                  className="btn btn-success"
                >
                  {submission.marks !== null ? 'Update Grade' : 'Grade'}
                </button>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </section>
  );
};

export default TeacherDashboard;

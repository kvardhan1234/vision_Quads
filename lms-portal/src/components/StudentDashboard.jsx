import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState(null);

  useEffect(() => {
    console.log('📚 StudentDashboard mounted');
    const userData = localStorage.getItem('user');
    console.log('👤 User data from localStorage:', userData);
    
    if (!userData) {
      console.log('❌ No user data found, redirecting to login');
      navigate('/login/student');
      return;
    }

    const parsedUser = JSON.parse(userData);
    console.log('✅ Parsed user:', parsedUser);
    setStudent(parsedUser);

    fetchCoursesAndEvents();
  }, [navigate]);

  const fetchCoursesAndEvents = async () => {
    try {
      // Fetch all courses
      const coursesResp = await fetch('http://localhost:5000/api/courses');
      const coursesData = await coursesResp.json();
      
      // Parse files if they're JSON strings
      const parsedCourses = (coursesData.courses || []).map(course => ({
        ...course,
        files: typeof course.files === 'string' ? JSON.parse(course.files || '[]') : (course.files || [])
      }));
      
      setCourses(parsedCourses);

      // Fetch upcoming events
      const eventsResp = await fetch('http://localhost:5000/api/events');
      const eventsData = await eventsResp.json();
      setEvents(eventsData.events || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    if (!student) return;

    try {
      const resp = await fetch(`http://localhost:5000/api/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: student.id || student._id })
      });

      if (!resp.ok) {
        const error = await resp.json();
        alert(error.error || 'Enrollment failed');
        return;
      }

      alert('Successfully enrolled!');
      setExpandedCourse(courseId);
      fetchCoursesAndEvents(); // Refresh data
    } catch (error) {
      console.error('Enrollment error:', error);
      alert('Failed to enroll in course');
    }
  };

  const handleSubmitAssignment = async (courseId) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx,.txt';
    
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('assignmentFile', file);
      formData.append('courseId', courseId);
      formData.append('studentId', student.id || student._id);
      formData.append('studentName', student.name);
      formData.append('studentRollNo', student.rollNo);

      try {
        const resp = await fetch('http://localhost:5000/api/assignments/submit', {
          method: 'POST',
          body: formData
        });

        if (!resp.ok) {
          const error = await resp.json();
          alert(error.error || 'Submission failed');
          return;
        }

        alert('Assignment submitted successfully!');
      } catch (error) {
        console.error('Submission error:', error);
        alert('Failed to submit assignment');
      }
    };

    fileInput.click();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login/student');
  };

  const isEnrolled = (course) => {
    if (!student) return false;
    const studentId = student.id || student._id;
    return course.enrollments?.some(e => {
      const enrollmentStudentId = e.studentId?.id || e.studentId?._id || e.studentId;
      return enrollmentStudentId === studentId;
    });
  };

  const getStudentMarks = (course) => {
    if (!student) return null;
    const studentId = student.id || student._id;
    const enrollment = course.enrollments?.find(e => {
      const enrollmentStudentId = e.studentId?.id || e.studentId?._id || e.studentId;
      return enrollmentStudentId === studentId;
    });
    return enrollment?.marks;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>LearnHub - Student Dashboard</h1>
        <div className="header-actions">
          <span className="user-name">Welcome, {student?.name}</span>
          <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="courses-section">
          <h2>Available Courses</h2>
          {courses.length === 0 ? (
            <p className="no-data">No courses are allocated yet.</p>
          ) : (
            <div className="courses-grid">
              {courses.map((course) => {
                const enrolled = isEnrolled(course);
                const courseId = course.id || course._id;
                const expanded = expandedCourse === courseId || enrolled;
                const marks = getStudentMarks(course);

                return (
                  <div key={courseId} className={`course-card ${expanded ? 'expanded' : ''}`}>
                    <h3>{course.title}</h3>
                    <p className="course-description">{course.description}</p>
                    <p className="course-instructor">Instructor: {course.instructor?.name}</p>
                    
                    {course.deadline && (
                      <p className="course-deadline">
                        Deadline: {new Date(course.deadline).toLocaleDateString()}
                      </p>
                    )}

                    {marks !== null && marks !== undefined && (
                      <div className="course-marks">
                        <strong>Your Marks: {marks}</strong>
                      </div>
                    )}

                    {!enrolled && (
                      <button 
                        onClick={() => handleEnroll(courseId)} 
                        className="btn btn-primary"
                      >
                        Enroll
                      </button>
                    )}

                    {expanded && (
                      <div className="course-details">
                        <h4>Course Materials</h4>
                        {course.files && Array.isArray(course.files) && course.files.length > 0 ? (
                          <ul className="course-files">
                            {course.files.map((file, idx) => (
                              <li key={idx}>
                                <a 
                                  href={`http://localhost:5000${file.path}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  📄 {file.filename}
                                </a>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No materials uploaded yet.</p>
                        )}

                        {course.assignmentEnabled && enrolled && (
                          <div className="assignment-section">
                            <h4>Assignment</h4>
                            <p>Assignment submission is enabled for this course.</p>
                            <button 
                              onClick={() => handleSubmitAssignment(courseId)}
                              className="btn btn-success"
                            >
                              Submit Assignment
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="events-section">
          <h2>Upcoming Events</h2>
          {events.length === 0 ? (
            <p className="no-data">No upcoming events.</p>
          ) : (
            <div className="events-list">
              {events.map((event) => {
                const eventId = event.id || event._id;
                return (
                  <div key={eventId} className="event-card">
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                    <p className="event-date">
                      📅 {new Date(event.eventDate).toLocaleDateString()}
                    </p>
                    {event.relatedCourse && (
                      <p className="event-course">Related to: {event.relatedCourse.title}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default StudentDashboard;

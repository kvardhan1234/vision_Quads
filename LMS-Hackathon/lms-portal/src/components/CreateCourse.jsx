// lms-portal/src/components/CreateCourse.jsx

import React, { useState } from 'react';

const CreateCourse = () => {
    // NOTE: Replace hardcoded ID with authenticated teacher ID later
    // CORRECTED LINE: The whole destructuring assignment must be one statement.
    const [instructorId, setInstructorId] = useState('placeholder_teacher_id'); 

    // The rest of your code follows...
    const [formData, setFormData] = useState({ 
        title: '',
        description: '',
        duration: ''
    });

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // ... (rest of the component logic)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/teacher/courses', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, instructorId }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to create course');
            }

            setMessage('✅ Course created successfully!');
            setFormData({ title: '', description: '', duration: '' }); // Clear form

        } catch (error) {
            setMessage(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-course-container" style={{ padding: 40, maxWidth: 800, margin: '0 auto' }}>
            <h1>Create New Course</h1>
            <p>Define the title, description, and expected duration of the course.</p>
            
            {message && <div className={`message ${message.includes('✅') ? 'message-success' : 'message-error'}`}>{message}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: 8 }}>Course Title</label>
                    <input 
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        style={{ padding: 10, width: '100%', border: '1px solid #ccc' }} 
                        placeholder="e.g., Basics of Python" 
                    />
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: 8 }}>Description</label>
                    <textarea 
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="4"
                        style={{ padding: 10, width: '100%', border: '1px solid #ccc' }} 
                        placeholder="Provide a detailed course summary." 
                    />
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: 8 }}>Duration</label>
                    <input 
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                        style={{ padding: 10, width: '100%', border: '1px solid #ccc' }} 
                        placeholder="e.g., 6 Weeks, Self-Paced" 
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ padding: '12px 20px', background: '#1e40af', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    {loading ? 'Creating...' : 'Create Course'}
                </button>
            </form>
        </div>
    );
};

export default CreateCourse;
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Calls the backend /api/login endpoint for admin/staff
export async function loginUser({ email, password }) {
  if (!email || !password) throw new Error('Email and password are required');

  const resp = await fetch(`${API_BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!resp.ok) {
    const body = await resp.json().catch(() => ({}));
    throw new Error(body.error || 'Login failed');
  }

  return resp.json();
}

// Calls the backend /api/login-student endpoint for students
export async function loginStudent({ identifier, password }) {
  if (!identifier || !password) throw new Error('Email/Roll Number and password are required');

  const resp = await fetch(`${API_BASE_URL}/api/login-student`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });

  if (!resp.ok) {
    const body = await resp.json().catch(() => ({}));
    throw new Error(body.error || 'Student login failed');
  }

  const data = await resp.json();
  
  // Store student info in localStorage
  if (data.student) {
    localStorage.setItem('user', JSON.stringify(data.student));
    localStorage.setItem('role', 'Student');
    localStorage.setItem('isLoggedIn', 'true');
  }
  
  return data;
}

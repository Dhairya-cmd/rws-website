import React, { useState } from 'react';
import './AdminLogin.css';

function AdminLogin({ onLoginSuccess, onClose }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (data.success) {
        // Save the token from the backend
        localStorage.setItem('adminToken', data.token);
        onLoginSuccess();
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Server Error: Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-overlay">
      <div className="admin-login-modal">
        <button className="close-modal" onClick={onClose}>✕</button>
        <div className="login-header">
          <span className="tag">Restricted Area</span>
          <h2>Admin Login</h2>
        </div>
        <form onSubmit={submitLogin}>
          <div className="form-group">
            <label>Username</label>
            <input name="username" type="text" onChange={handleInput} placeholder="Username" required disabled={loading} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" onChange={handleInput} placeholder="Password" required disabled={loading} />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
            {loading ? 'Verifying...' : 'Login to Dashboard →'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
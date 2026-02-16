import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userAuthService from '../services/userAuthService';
import './Login.css';

function UserLogin() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await userAuthService.login(name, password);
      navigate('/user/profile');
    } catch (err) {
      setError(
        err.response?.data?.error || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const goToAdminLogin = () => {
    navigate('/login');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>User Login</h1>
          <p>Semester Reading Group Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Admin? <button onClick={goToAdminLogin} className="link-button">Login here</button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
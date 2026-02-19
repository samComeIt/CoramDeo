import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const admin = authService.getCurrentAdmin();

  const handleLogout = () => {
    authService.logout();
    // Force a full page reload to clear all state
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h2>Coram Deo</h2>
        </div>
        <div className="nav-user">
          <span>Welcome, {admin?.name}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Manage your reading groups, semesters, and participants</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon">🔐</div>
            <h3>Admins</h3>
            <p>Manage admin accounts and permissions</p>
            <button className="card-button" onClick={() => navigate('/admins')}>
              View Admins
            </button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">👥</div>
            <h3>Groups</h3>
            <p>Manage reading groups and add persons</p>
            <button className="card-button" onClick={() => navigate('/groups')}>
              View Groups
            </button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">👤</div>
            <h3>Persons</h3>
            <p>Manage participants with name and password</p>
            <button className="card-button" onClick={() => navigate('/persons')}>
              View Persons
            </button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📅</div>
            <h3>Semesters</h3>
            <p>Manage semesters and assign groups</p>
            <button className="card-button" onClick={() => navigate('/semesters')}>
              View Semesters
            </button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📚</div>
            <h3>Books</h3>
            <p>Manage book library with title, author, and description</p>
            <button className="card-button" onClick={() => navigate('/books')}>
              View Books
            </button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📋</div>
            <h3>All Participations</h3>
            <p>View and manage all participations with advanced filtering</p>
            <button className="card-button" onClick={() => navigate('/admin/participations')}>
              View All Participations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
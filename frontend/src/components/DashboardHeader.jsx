import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './DashboardHeader.css';

function DashboardHeader({ showNavigation = false, semesterId, groupId }) {
  const navigate = useNavigate();
  const admin = authService.getCurrentAdmin();
  const isSuperAdmin = admin?.type === 'superadmin';

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="dashboard-nav">
      <div className="nav-brand">
        <h2>Coram Deo</h2>
      </div>
      <div className="nav-user">
        <span>Welcome, {admin?.name}</span>
        <button onClick={() => navigate('/dashboard')} className="back-button">
          Dashboard
        </button>
        {showNavigation && isSuperAdmin && (
          <>
            <button onClick={() => navigate('/semesters')} className="back-button">
              Semesters
            </button>
            {semesterId && (
              <button onClick={() => navigate(`/semesters/${semesterId}/groups`)} className="back-button">
                Groups
              </button>
            )}
            {semesterId && groupId && (
              <button onClick={() => navigate(`/semesters/${semesterId}/groups/${groupId}/persons`)} className="back-button">
                Persons
              </button>
            )}
          </>
        )}
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default DashboardHeader;

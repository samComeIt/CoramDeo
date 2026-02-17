import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import semesterService from '../services/semesterService';
import authService from '../services/authService';
import './SemesterGroups.css';

function SemesterGroups() {
  const { semesterId } = useParams();
  const [semester, setSemester] = useState(null);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const admin = authService.getCurrentAdmin();

  useEffect(() => {
    fetchSemesterAndGroups();
  }, [semesterId]);

  const fetchSemesterAndGroups = async () => {
    try {
      setLoading(true);
      const [semesterData, groupsData] = await Promise.all([
        semesterService.getSemesterById(semesterId),
        semesterService.getSemesterGroups(semesterId)
      ]);
      setSemester(semesterData);
      setGroups(Array.from(groupsData));
      setError('');
    } catch (err) {
      setError('Failed to load semester groups');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleGroupClick = (groupId) => {
    navigate(`/semesters/${semesterId}/groups/${groupId}/persons`);
  };

  const groupColors = [
    '#667eea', '#764ba2', '#4facfe', '#43e97b',
    '#fa709a', '#30cfd0', '#f093fb', '#fee140'
  ];
  const getGroupColor = (id) => groupColors[id % groupColors.length];

  return (
    <div className="semester-groups-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h2>Coram Deo</h2>
        </div>
        <div className="nav-user">
          <span>Welcome, {admin?.name}</span>
          <button onClick={() => navigate('/dashboard')} className="back-button">
            Dashboard
          </button>
          <button onClick={() => navigate('/semesters')} className="back-button">
            Semesters
          </button>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>

      <div className="semester-groups-content">
        <div className="semester-groups-header">
          <div className="breadcrumb">
            <span className="breadcrumb-item" onClick={() => navigate('/semesters')}>Semesters</span>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-current">{semester?.name}</span>
          </div>
          <h1>{semester?.name}</h1>
          <p>Select a group to view its participants</p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading groups...</p>
          </div>
        ) : groups.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No groups in this semester</h3>
            <p>Go back to Semesters to add groups</p>
            <button onClick={() => navigate('/semesters')} className="nav-btn">
              ← Back to Semesters
            </button>
          </div>
        ) : (
          <>
            <div className="count-label">{groups.length} group{groups.length !== 1 ? 's' : ''}</div>
            <div className="sg-grid">
              {groups.map((group) => (
                <div
                  key={group.groupId}
                  className="sg-card"
                  onClick={() => handleGroupClick(group.groupId)}
                >
                  <div
                    className="sg-card-accent"
                    style={{ background: getGroupColor(group.groupId) }}
                  />
                  <div className="sg-card-icon" style={{ color: getGroupColor(group.groupId) }}>
                    📚
                  </div>
                  <div className="sg-card-info">
                    <h3>{group.groupName}</h3>
                    <span className="sg-card-sub">ID #{group.groupId}</span>
                  </div>
                  <div className="sg-card-arrow">›</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SemesterGroups;
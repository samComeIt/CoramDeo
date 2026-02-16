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

  return (
    <div className="semester-groups-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h2>Semester Reading Group</h2>
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
          <div>
            <h1>{semester?.name} - Groups</h1>
            <p>Select a group to view participants</p>
          </div>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <div className="loading">Loading groups...</div>
        ) : groups.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No groups in this semester</h3>
            <p>Go back to semesters to add groups</p>
            <button onClick={() => navigate('/semesters')} className="back-button">
              Back to Semesters
            </button>
          </div>
        ) : (
          <div className="groups-grid">
            {groups.map((group) => (
              <div
                key={group.groupId}
                className="group-card"
                onClick={() => handleGroupClick(group.groupId)}
              >
                <div className="group-card-icon">📚</div>
                <h3>{group.groupName}</h3>
                <p>Group ID: {group.groupId}</p>
                <button className="view-persons-btn">
                  View Persons →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SemesterGroups;
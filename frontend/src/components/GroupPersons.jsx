import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import groupService from '../services/groupService';
import semesterService from '../services/semesterService';
import authService from '../services/authService';
import './GroupPersons.css';

function GroupPersons() {
  const { semesterId, groupId } = useParams();
  const [semester, setSemester] = useState(null);
  const [group, setGroup] = useState(null);
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const admin = authService.getCurrentAdmin();

  useEffect(() => {
    fetchGroupPersons();
  }, [semesterId, groupId]);

  const fetchGroupPersons = async () => {
    try {
      setLoading(true);
      const [semesterData, groupData, personsData] = await Promise.all([
        semesterService.getSemesterById(semesterId),
        groupService.getGroupById(groupId),
        groupService.getGroupPersons(groupId)
      ]);
      setSemester(semesterData);
      setGroup(groupData);
      setPersons(Array.from(personsData));
      setError('');
    } catch (err) {
      setError('Failed to load group persons');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handlePersonClick = (personId) => {
    navigate(`/semesters/${semesterId}/groups/${groupId}/persons/${personId}/participations`);
  };

  return (
    <div className="group-persons-container">
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
          <button onClick={() => navigate(`/semesters/${semesterId}/groups`)} className="back-button">
            Groups
          </button>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>

      <div className="group-persons-content">
        <div className="group-persons-header">
          <div>
            <h1>{semester?.name} - {group?.groupName}</h1>
            <p>Select a person to view their participations</p>
          </div>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <div className="loading">Loading persons...</div>
        ) : persons.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No persons in this group</h3>
            <p>Go back to groups to add persons</p>
            <button onClick={() => navigate(`/semesters/${semesterId}/groups`)} className="back-button">
              Back to Groups
            </button>
          </div>
        ) : (
          <div className="persons-grid">
            {persons.map((person) => (
              <div
                key={person.personId}
                className="person-card"
                onClick={() => handlePersonClick(person.personId)}
              >
                <div className="person-card-icon">👤</div>
                <h3>{person.name}</h3>
                <p>Person ID: {person.personId}</p>
                <button className="view-participations-btn">
                  View Participations →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GroupPersons;
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
  const [search, setSearch] = useState('');
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

  const getInitials = (name) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const avatarColors = [
    '#667eea', '#764ba2', '#f093fb', '#4facfe',
    '#43e97b', '#fa709a', '#fee140', '#30cfd0'
  ];
  const getAvatarColor = (id) => avatarColors[id % avatarColors.length];

  const filtered = persons.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="group-persons-container">
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
          <div className="breadcrumb">
            <span className="breadcrumb-item" onClick={() => navigate('/semesters')}>Semesters</span>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-item" onClick={() => navigate(`/semesters/${semesterId}/groups`)}>
              {semester?.name}
            </span>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-current">{group?.groupName}</span>
          </div>
          <h1>{group?.groupName}</h1>
          <p>{semester?.name} · Select a person to view their participations</p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading persons...</p>
          </div>
        ) : persons.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No persons in this group</h3>
            <p>Go back to Groups to add persons</p>
            <button onClick={() => navigate(`/semesters/${semesterId}/groups`)} className="nav-btn">
              ← Back to Groups
            </button>
          </div>
        ) : (
          <>
            <div className="gp-toolbar">
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button className="search-clear" onClick={() => setSearch('')}>×</button>
                )}
              </div>
              <span className="count-label">
                {filtered.length} person{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>

            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No results for "{search}"</h3>
                <p>Try a different name</p>
              </div>
            ) : (
              <div className="gp-grid">
                {filtered.map((person) => (
                  <div
                    key={person.personId}
                    className="gp-card"
                    onClick={() => handlePersonClick(person.personId)}
                  >
                    <div
                      className="gp-avatar"
                      style={{ background: getAvatarColor(person.personId) }}
                    >
                      {getInitials(person.name)}
                    </div>
                    <div className="gp-info">
                      <h3>{person.name}</h3>
                      <span className="gp-sub">ID #{person.personId}</span>
                    </div>
                    <div className="gp-arrow">›</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default GroupPersons;
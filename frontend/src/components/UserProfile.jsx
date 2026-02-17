import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userAuthService from '../services/userAuthService';
import userService from '../services/userService';
import './UserProfile.css';

function UserProfile() {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserSemesters();
  }, []);

  const fetchUserSemesters = async () => {
    try {
      const userId = userAuthService.getUserId();
      console.log('Fetching semesters for user ID:', userId);

      if (!userId) {
        setError('Not logged in. Please login again.');
        return;
      }

      const data = await userService.getUserSemesters(userId);
      console.log('Semesters received:', data);
      setSemesters(data.semesters || []);
    } catch (err) {
      console.error('Error fetching semesters:', err);
      setError('Failed to load profile data: ' + (err.response?.data?.error || err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    userAuthService.logout();
    // Force a full page reload to clear all state
    window.location.href = '/user/login';
  };

  const handleViewGroup = (semesterId, groupId) => {
    navigate(`/user/semester/${semesterId}/group/${groupId}/participations`);
  };

  if (loading) {
    return (
      <div className="user-profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-profile-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="user-profile-container">
      <div className="user-profile-header">
        <div className="header-content">
          <h1>사랑하고 축복합니다, {userAuthService.getUserName()}!</h1>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      <div className="user-profile-content">
        <h2>My Semester List</h2>

        {semesters && semesters.length > 0 ? (
          <div className="semesters-list">
            {semesters.map((semester) => (
              <div key={semester.semesterId} className="semester-card">
                <div className="semester-header">
                  <div>
                    <h3>{semester.semesterName}</h3>
                  </div>
                </div>

                <div className="groups-section">
                  {semester.groups && semester.groups.length > 0 ? (
                    <div className="groups-grid">
                      {semester.groups.map((group) => {
                        const formattedDate = group.participationDate
                          ? new Date(group.participationDate).toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                            }).replace(/\. /g, '.').replace(/\.$/, '')
                          : '';

                        return (
                          <div
                            key={group.groupId}
                            className="group-card"
                            onClick={() => handleViewGroup(semester.semesterId, group.groupId)}
                          >
                            <div className="group-icon">📚</div>
                            <div className="group-name">
                              {group.groupName}
                            </div>
                            <div className="view-link">View Records →</div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="no-data">No groups in this semester</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data-card">
            <p>You are not enrolled in any semesters yet.</p>
            <p>Contact your administrator for enrollment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
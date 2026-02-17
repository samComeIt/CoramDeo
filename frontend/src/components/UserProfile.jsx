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

  const userName = userAuthService.getUserName() || '';

  useEffect(() => {
    fetchUserSemesters();
  }, []);

  const fetchUserSemesters = async () => {
    try {
      const userId = userAuthService.getUserId();
      if (!userId) {
        setError('Not logged in. Please login again.');
        return;
      }
      const data = await userService.getUserSemesters(userId);
      setSemesters(data.semesters || []);
    } catch (err) {
      setError('Failed to load profile data: ' + (err.response?.data?.error || err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    userAuthService.logout();
    window.location.href = '/user/login';
  };

  const handleViewGroup = (semesterId, groupId) => {
    navigate(`/user/semester/${semesterId}/group/${groupId}/participations`);
  };

  const getInitials = (name) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const groupColors = [
    '#667eea', '#764ba2', '#4facfe', '#43e97b',
    '#fa709a', '#30cfd0', '#f093fb', '#fee140'
  ];
  const getGroupColor = (id) => groupColors[id % groupColors.length];

  if (loading) {
    return (
      <div className="up-container">
        <div className="up-loading-state">
          <div className="up-spinner" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="up-container">
        <div className="up-error-card">
          <p>{error}</p>
          <button onClick={() => window.location.href = '/user/login'} className="up-btn-primary">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="up-container">
      {/* ── Hero Header ── */}
      <div className="up-hero">
        <div className="up-hero-inner">
          <div className="up-avatar">{getInitials(userName)}</div>
          <div className="up-hero-text">
            <p className="up-greeting">사랑하고 축복합니다</p>
            <h1 className="up-name">{userName}</h1>
            <p className="up-meta">{semesters.length}개 학기 등록됨</p>
          </div>
          <button onClick={handleLogout} className="up-logout-btn">
            Logout
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="up-content">
        {semesters.length === 0 ? (
          <div className="up-empty">
            <span className="up-empty-icon">📋</span>
            <h3>등록된 학기가 없습니다</h3>
            <p>관리자에게 문의하여 학기 등록을 요청하세요.</p>
          </div>
        ) : (
          <div className="up-semesters">
            {semesters.map((semester) => (
              <div key={semester.semesterId} className="up-semester-block">
                <div className="up-semester-label">
                  <span className="up-semester-dot" />
                  <h2>{semester.semesterName}</h2>
                </div>

                {semester.groups && semester.groups.length > 0 ? (
                  <div className="up-groups">
                    {semester.groups.map((group) => (
                      <div
                        key={group.groupId}
                        className="up-group-row"
                        onClick={() => handleViewGroup(semester.semesterId, group.groupId)}
                      >
                        <div
                          className="up-group-accent"
                          style={{ background: getGroupColor(group.groupId) }}
                        />
                        <div
                          className="up-group-icon"
                          style={{ color: getGroupColor(group.groupId) }}
                        >
                          📚
                        </div>
                        <div className="up-group-info">
                          <span className="up-group-name">{group.groupName}</span>
                          <span className="up-group-sub">출석 및 기록 보기</span>
                        </div>
                        <div className="up-group-arrow">›</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="up-no-groups">이 학기에 소속된 그룹이 없습니다.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
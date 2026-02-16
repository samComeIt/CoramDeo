import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import userAuthService from '../services/userAuthService';
import userService from '../services/userService';
import './UserParticipation.css';

function UserParticipation() {
  const { semesterId, groupId } = useParams();
  const navigate = useNavigate();
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchParticipations();
  }, [semesterId, groupId]);

  const fetchParticipations = async () => {
    try {
      const userId = userAuthService.getUserId();
      const data = await userService.getUserParticipations(userId, semesterId, groupId);
      setParticipations(data);
    } catch (err) {
      setError('Failed to load participations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (participation) => {
    setEditingRecord(participation.participationId);
    setFormData(participation.weeklyRecord || {
      weekNumber: 1,
      service1: 'absent',
      service2: 'absent',
      summary1: false,
      summary2: false,
      qt: 0,
      reading: 0,
      pray: 0,
      memorize: 0,
      submittedDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleCancel = () => {
    setEditingRecord(null);
    setFormData({});
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e, participationId) => {
    e.preventDefault();
    try {
      await userService.updateWeeklyRecord(participationId, formData);
      await fetchParticipations();
      setEditingRecord(null);
      setFormData({});
      alert('Record updated successfully!');
    } catch (err) {
      alert('Failed to update record: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleBackToProfile = () => {
    navigate('/user/profile');
  };

  if (loading) {
    return (
      <div className="user-participation-container">
        <div className="loading">Loading participations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-participation-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  const firstParticipation = participations[0];

  return (
    <div className="user-participation-container">
      <div className="user-participation-header">
        <button onClick={handleBackToProfile} className="back-button">
          ← Back to Profile
        </button>
        <div className="header-info">
          <h1>My Participation Records</h1>
          {firstParticipation && (
            <p className="header-subtitle">
              {firstParticipation.semesterName} - {firstParticipation.groupName}
            </p>
          )}
        </div>
      </div>

      <div className="user-participation-content">
        {participations.length > 0 ? (
          <div className="participations-list">
            {participations.map((participation) => (
              <div key={participation.participationId} className="participation-card">
                <div className="participation-header">
                  <div>
                    <h3>Week {participation.weeklyRecord?.weekNumber || 'N/A'}</h3>
                    <p className="participation-date">
                      {new Date(participation.participationDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`status-badge status-${participation.status}`}>
                    {participation.status}
                  </span>
                </div>

                {editingRecord === participation.participationId ? (
                  <form onSubmit={(e) => handleSubmit(e, participation.participationId)} className="record-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Week Number</label>
                        <input
                          type="number"
                          value={formData.weekNumber || 1}
                          onChange={(e) => handleChange('weekNumber', parseInt(e.target.value))}
                          min="1"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Service 1</label>
                        <select
                          value={formData.service1 || 'absent'}
                          onChange={(e) => handleChange('service1', e.target.value)}
                        >
                          <option value="ontime">On Time</option>
                          <option value="late">Late</option>
                          <option value="absent">Absent</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Service 2</label>
                        <select
                          value={formData.service2 || 'absent'}
                          onChange={(e) => handleChange('service2', e.target.value)}
                        >
                          <option value="ontime">On Time</option>
                          <option value="late">Late</option>
                          <option value="absent">Absent</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group checkbox-group">
                        <label>
                          <input
                            type="checkbox"
                            checked={formData.summary1 || false}
                            onChange={(e) => handleChange('summary1', e.target.checked)}
                          />
                          Summary 1 Completed
                        </label>
                      </div>

                      <div className="form-group checkbox-group">
                        <label>
                          <input
                            type="checkbox"
                            checked={formData.summary2 || false}
                            onChange={(e) => handleChange('summary2', e.target.checked)}
                          />
                          Summary 2 Completed
                        </label>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>QT (0-6 days)</label>
                        <input
                          type="number"
                          value={formData.qt || 0}
                          onChange={(e) => handleChange('qt', parseInt(e.target.value))}
                          min="0"
                          max="6"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Reading (0-35 chapters)</label>
                        <input
                          type="number"
                          value={formData.reading || 0}
                          onChange={(e) => handleChange('reading', parseInt(e.target.value))}
                          min="0"
                          max="35"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Prayer (0-7 days)</label>
                        <input
                          type="number"
                          value={formData.pray || 0}
                          onChange={(e) => handleChange('pray', parseInt(e.target.value))}
                          min="0"
                          max="7"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Memorize (0-4)</label>
                        <input
                          type="number"
                          value={formData.memorize || 0}
                          onChange={(e) => handleChange('memorize', parseInt(e.target.value))}
                          min="0"
                          max="4"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Submitted Date</label>
                        <input
                          type="date"
                          value={formData.submittedDate || ''}
                          onChange={(e) => handleChange('submittedDate', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="save-button">Save Changes</button>
                      <button type="button" onClick={handleCancel} className="cancel-button">Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div className="record-display">
                    {participation.weeklyRecord ? (
                      <>
                        <div className="record-grid">
                          <div className="record-item">
                            <span className="record-label">Service 1:</span>
                            <span className={`record-value status-${participation.weeklyRecord.service1}`}>
                              {participation.weeklyRecord.service1}
                            </span>
                          </div>

                          <div className="record-item">
                            <span className="record-label">Service 2:</span>
                            <span className={`record-value status-${participation.weeklyRecord.service2}`}>
                              {participation.weeklyRecord.service2}
                            </span>
                          </div>

                          <div className="record-item">
                            <span className="record-label">Summary 1:</span>
                            <span className="record-value">{participation.weeklyRecord.summary1 ? '✓' : '✗'}</span>
                          </div>

                          <div className="record-item">
                            <span className="record-label">Summary 2:</span>
                            <span className="record-value">{participation.weeklyRecord.summary2 ? '✓' : '✗'}</span>
                          </div>

                          <div className="record-item">
                            <span className="record-label">QT:</span>
                            <span className="record-value">{participation.weeklyRecord.qt}/6</span>
                          </div>

                          <div className="record-item">
                            <span className="record-label">Reading:</span>
                            <span className="record-value">{participation.weeklyRecord.reading}/35</span>
                          </div>

                          <div className="record-item">
                            <span className="record-label">Prayer:</span>
                            <span className="record-value">{participation.weeklyRecord.pray}/7</span>
                          </div>

                          <div className="record-item">
                            <span className="record-label">Memorize:</span>
                            <span className="record-value">{participation.weeklyRecord.memorize}/4</span>
                          </div>
                        </div>

                        <button onClick={() => handleEdit(participation)} className="edit-button">
                          Edit Record
                        </button>
                      </>
                    ) : (
                      <div className="no-record">
                        <p>No weekly record yet</p>
                        <button onClick={() => handleEdit(participation)} className="add-button">
                          Add Record
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data-card">
            <p>No participation records found for this group.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserParticipation;
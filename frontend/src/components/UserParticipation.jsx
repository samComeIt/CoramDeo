import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import userAuthService from '../services/userAuthService';
import userService from '../services/userService';
import semesterUserBookService from '../services/semesterUserBookService';
import semesterService from '../services/semesterService';
import './UserParticipation.css';

function UserParticipation() {
  const { semesterId, groupId } = useParams();
  const navigate = useNavigate();
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({});
  const [semesterUserBooks, setSemesterUserBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [bookFormData, setBookFormData] = useState({ status: 'N/A' });
  const [semester, setSemester] = useState(null);

  useEffect(() => {
    fetchData();
  }, [semesterId, groupId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchParticipations(),
        fetchSemesterUserBooks(),
        semesterService.getSemesterById(semesterId).then(setSemester)
      ]);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipations = async () => {
    try {
      const userId = userAuthService.getUserId();
      const data = await userService.getUserParticipations(userId, semesterId, groupId);
      setParticipations(data);
    } catch (err) {
      setError('Failed to load participations');
      console.error(err);
    }
  };

  const fetchSemesterUserBooks = async () => {
    try {
      const userId = userAuthService.getUserId();
      const books = await semesterUserBookService.getSemesterUserBooksBySemesterAndPerson(
        semesterId,
        userId
      );
      setSemesterUserBooks(books);
    } catch (err) {
      console.error('Failed to fetch semester user books:', err);
    }
  };

  const handleEdit = (participation) => {
    setEditingRecord(participation.participationId);
    setFormData(participation.weeklyRecord || {
      weekNumber: 1,
      service1: 'N/A',
      service2: 'N/A',
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

  const formatServiceStatus = (status) => {
    if (!status) return 'N/A';
    if (status === 'ontime') return 'On Time';
    if (status === 'late') return 'Late';
    if (status === 'absent') return 'Absent';
    if (status === 'N/A') return 'N/A';
    return status;
  };

  const handleEditBook = (book) => {
    setEditingBook(book.id);
    setBookFormData({ status: book.status });
  };

  const handleCancelBookEdit = () => {
    setEditingBook(null);
    setBookFormData({ status: 'N/A' });
  };

  const handleBookStatusChange = (value) => {
    setBookFormData({ status: value });
  };

  const handleSaveBook = async (bookId) => {
    try {
      await semesterUserBookService.updateSemesterUserBook(bookId, bookFormData);
      await fetchSemesterUserBooks();
      setEditingBook(null);
      setBookFormData({ status: 'N/A' });
      alert('Book status updated successfully!');
    } catch (err) {
      alert('Failed to update book status: ' + (err.response?.data?.error || err.message));
    }
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
          ← 프로필로 뒤로가기
        </button>
        <div className="header-info">
          <h1>마이 코람데오</h1>
          {firstParticipation && (
            <p className="header-subtitle">
              {firstParticipation.semesterName} - {firstParticipation.groupName}
            </p>
          )}
        </div>
      </div>

      <div className="user-participation-content">
        {/* Book Assignment Section */}
        <div className="books-section">
          <h2>독서과제</h2>
          {semesterUserBooks.length > 0 ? (
            <div className="books-grid">
              {semesterUserBooks.map((userBook) => (
                <div key={userBook.id} className="book-card">
                  <div className="book-info">
                    <h3>{userBook.book.title}</h3>
                    <p className="book-author">by {userBook.book.author}</p>
                    {userBook.book.description && (
                      <p className="book-description">{userBook.book.description}</p>
                    )}
                  </div>

                  {editingBook === userBook.id ? (
                    <div className="book-status-edit">
                      <label>Status:</label>
                      <select
                        value={bookFormData.status}
                        onChange={(e) => handleBookStatusChange(e.target.value)}
                      >
                        <option value="N/A">N/A</option>
                        <option value="Not submitted">Not submitted</option>
                        <option value="submitted">Submitted</option>
                      </select>
                      <div className="book-actions">
                        <button onClick={() => handleSaveBook(userBook.id)} className="save-button">
                          Save
                        </button>
                        <button onClick={handleCancelBookEdit} className="cancel-button">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="book-status-display">
                      <span className="status-label">Status:</span>
                      <span className={`status-badge status-${userBook.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {userBook.status}
                      </span>
                      <button onClick={() => handleEditBook(userBook)} className="edit-button">
                        Update Status
                      </button>
                    </div>
                  )}

                  <div className="book-date">
                    <small>Due Date: {new Date(userBook.date).toLocaleDateString()}</small>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-books-message">
              <p>No books assigned yet.</p>
            </div>
          )}
        </div>

        {/* Participation Records Section */}
        <div className="records-section">
          <h2>마이 코람데오 리스트</h2>
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
                        <label>대예배 출석</label>
                        <select
                          value={formData.service1 || 'N/A'}
                          onChange={(e) => handleChange('service1', e.target.value)}
                        >
                          <option value="N/A">N/A</option>
                          <option value="ontime">On Time</option>
                          <option value="late">Late</option>
                          <option value="absent">Absent</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>대청부 출석</label>
                        <select
                          value={formData.service2 || 'N/A'}
                          onChange={(e) => handleChange('service2', e.target.value)}
                        >
                          <option value="N/A">N/A</option>
                          <option value="ontime">On Time</option>
                          <option value="late">Late</option>
                          <option value="absent">Absent</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>대예배 설교요약</label>
                        <select
                          value={formData.summary1 === true ? 'O' : formData.summary1 === false ? 'X' : 'X'}
                          onChange={(e) => handleChange('summary1', e.target.value === 'O')}
                        >
                          <option value="X">X</option>
                          <option value="O">O</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>대청부 설교요약</label>
                        <select
                          value={formData.summary2 === true ? 'O' : formData.summary2 === false ? 'X' : 'X'}
                          onChange={(e) => handleChange('summary2', e.target.value === 'O')}
                        >
                          <option value="X">X</option>
                          <option value="O">O</option>
                        </select>
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
                        <label>말씀 (0-35 chapters)</label>
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
                        <label>기도(30분) (0-7 days)</label>
                        <input
                          type="number"
                          value={formData.pray || 0}
                          onChange={(e) => handleChange('pray', parseInt(e.target.value))}
                          min="0"
                          max="7"
                          required
                        />
                      </div>

                      {!semester?.isBreak && (
                        <div className="form-group">
                          <label>암송 (0-4)</label>
                          <input
                            type="number"
                            value={formData.memorize || 0}
                            onChange={(e) => handleChange('memorize', parseInt(e.target.value))}
                            min="0"
                            max="4"
                            required
                          />
                        </div>
                      )}
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
                            <span className="record-label">대예배 출석:</span>
                            <span className={`record-value status-${participation.weeklyRecord.service1}`}>
                              {formatServiceStatus(participation.weeklyRecord.service1)}
                            </span>
                          </div>

                          <div className="record-item">
                            <span className="record-label">대청부 출석:</span>
                            <span className={`record-value status-${participation.weeklyRecord.service2}`}>
                              {formatServiceStatus(participation.weeklyRecord.service2)}
                            </span>
                          </div>

                          <div className="record-item">
                            <span className="record-label">대예배 설교요약:</span>
                            <span className="record-value">{participation.weeklyRecord.summary1 ? 'O' : 'X'}</span>
                          </div>

                          <div className="record-item">
                            <span className="record-label">대청부 설교요약:</span>
                            <span className="record-value">{participation.weeklyRecord.summary2 ? 'O' : 'X'}</span>
                          </div>

                          <div className="record-item">
                            <span className="record-label">QT:</span>
                            <span className="record-value">{participation.weeklyRecord.qt}/6</span>
                          </div>

                          <div className="record-item">
                            <span className="record-label">말씀:</span>
                            <span className="record-value">{participation.weeklyRecord.reading}/35</span>
                          </div>

                          <div className="record-item">
                            <span className="record-label">기도(30분):</span>
                            <span className="record-value">{participation.weeklyRecord.pray}/7</span>
                          </div>

                          {!semester?.isBreak && (
                            <div className="record-item">
                              <span className="record-label">암송:</span>
                              <span className="record-value">{participation.weeklyRecord.memorize}/4</span>
                            </div>
                          )}
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
            <div className="no-records-message">
              <p>No participation records found for this group.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserParticipation;
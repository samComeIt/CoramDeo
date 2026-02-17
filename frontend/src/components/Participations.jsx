import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { participationService } from '../services/participationService';
import { recordService } from '../services/recordService';
import semesterService from '../services/semesterService';
import groupService from '../services/groupService';
import personService from '../services/personService';
import bookService from '../services/bookService';
import semesterUserBookService from '../services/semesterUserBookService';
import authService from '../services/authService';
import './Participations.css';

function Participations() {
  const { semesterId, groupId, personId } = useParams();
  const [semester, setSemester] = useState(null);
  const [group, setGroup] = useState(null);
  const [person, setPerson] = useState(null);
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingParticipation, setEditingParticipation] = useState(null);
  const [formData, setFormData] = useState({
    status: 'ontime',
    participationDate: ''
  });
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [currentParticipation, setCurrentParticipation] = useState(null);
  const [recordFormData, setRecordFormData] = useState({
    weekNumber: '',
    service1: 'N/A',
    service2: 'N/A',
    summary1: false,
    summary2: false,
    qt: 0,
    reading: 0,
    pray: 0,
    memorize: 0,
    submittedDate: ''
  });
  const [semesterUserBooks, setSemesterUserBooks] = useState([]);
  const [showBookModal, setShowBookModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [bookFormData, setBookFormData] = useState({
    bookId: '',
    status: 'N/A',
    date: ''
  });
  const navigate = useNavigate();
  const admin = authService.getCurrentAdmin();

  useEffect(() => {
    fetchData();
  }, [semesterId, groupId, personId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [semesterData, groupData, personData, books] = await Promise.all([
        semesterService.getSemesterById(semesterId),
        groupService.getGroupById(groupId),
        personService.getPersonById(personId),
        bookService.getAllBooks()
      ]);
      setSemester(semesterData);
      setGroup(groupData);
      setPerson(personData);
      setAvailableBooks(books);
      await fetchParticipations();
      await fetchSemesterUserBooks();
      setError('');
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipations = async () => {
    try {
      const allParticipations = await participationService.getParticipationsByPerson(personId);
      const filtered = allParticipations.filter(
        p => p.semester.semesterId === parseInt(semesterId) &&
             p.group.groupId === parseInt(groupId)
      );
      setParticipations(filtered);
    } catch (err) {
      console.error('Failed to fetch participations:', err);
    }
  };

  const fetchSemesterUserBooks = async () => {
    try {
      const books = await semesterUserBookService.getSemesterUserBooksBySemesterAndPerson(
        semesterId,
        personId
      );
      setSemesterUserBooks(books);
    } catch (err) {
      console.error('Failed to fetch semester user books:', err);
    }
  };

  const openBookModal = () => {
    setEditingBook(null);
    setBookFormData({ bookId: '', status: 'N/A', date: '' });
    setShowBookModal(true);
  };

  const openEditBookModal = (book) => {
    setEditingBook(book);
    setBookFormData({
      bookId: book.book.bookId,
      status: book.status,
      date: book.date
    });
    setShowBookModal(true);
  };

  const closeBookModal = () => {
    setShowBookModal(false);
    setEditingBook(null);
    setBookFormData({ bookId: '', status: 'N/A', date: '' });
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await semesterUserBookService.updateSemesterUserBook(editingBook.id, {
          status: bookFormData.status,
          date: bookFormData.date
        });
      } else {
        await semesterUserBookService.createSemesterUserBook(
          semesterId,
          personId,
          bookFormData.bookId,
          {
            status: bookFormData.status,
            date: bookFormData.date
          }
        );
      }
      await fetchSemesterUserBooks();
      closeBookModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save book assignment');
    }
  };

  const handleDeleteBook = async (id) => {
    if (window.confirm('Are you sure you want to delete this book assignment?')) {
      try {
        await semesterUserBookService.deleteSemesterUserBook(id);
        await fetchSemesterUserBooks();
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete book assignment');
      }
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const openCreateModal = () => {
    setEditingParticipation(null);
    setFormData({ status: 'ontime', participationDate: '' });
    setShowModal(true);
  };

  const openEditModal = (participation) => {
    setEditingParticipation(participation);
    setFormData({
      status: participation.status,
      participationDate: participation.participationDate
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingParticipation(null);
    setFormData({ status: 'ontime', participationDate: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingParticipation) {
        await participationService.updateParticipation(
          editingParticipation.participationId,
          formData
        );
      } else {
        await participationService.createParticipation(
          semesterId,
          groupId,
          personId,
          formData
        );
      }
      await fetchParticipations();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save participation');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this participation?')) {
      try {
        await participationService.deleteParticipation(id);
        await fetchParticipations();
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete participation');
      }
    }
  };

  const openRecordModal = async (participation) => {
    setCurrentParticipation(participation);
    if (participation.weeklyRecord) {
      setRecordFormData({
        weekNumber: participation.weeklyRecord.weekNumber,
        service1: participation.weeklyRecord.service1,
        service2: participation.weeklyRecord.service2,
        summary1: participation.weeklyRecord.summary1,
        summary2: participation.weeklyRecord.summary2,
        qt: participation.weeklyRecord.qt,
        reading: participation.weeklyRecord.reading,
        pray: participation.weeklyRecord.pray,
        memorize: participation.weeklyRecord.memorize,
        submittedDate: participation.weeklyRecord.submittedDate || ''
      });
    } else {
      setRecordFormData({
        weekNumber: '',
        service1: 'N/A',
        service2: 'N/A',
        summary1: false,
        summary2: false,
        qt: 0,
        reading: 0,
        pray: 0,
        memorize: 0,
        submittedDate: ''
      });
    }
    setShowRecordModal(true);
  };

  const closeRecordModal = () => {
    setShowRecordModal(false);
    setCurrentParticipation(null);
    setRecordFormData({
      weekNumber: '',
      service1: 'N/A',
      service2: 'N/A',
      summary1: false,
      summary2: false,
      qt: 0,
      reading: 0,
      pray: 0,
      memorize: 0,
      submittedDate: ''
    });
  };

  const handleRecordSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentParticipation.weeklyRecord) {
        await recordService.updateRecord(
          currentParticipation.weeklyRecord.recordId,
          recordFormData
        );
      } else {
        await recordService.createRecord(
          currentParticipation.participationId,
          recordFormData
        );
      }
      await fetchParticipations();
      closeRecordModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save weekly record');
    }
  };

  const handleDeleteRecord = async (recordId) => {
    if (window.confirm('Are you sure you want to delete this weekly record?')) {
      try {
        await recordService.deleteRecord(recordId);
        await fetchParticipations();
        closeRecordModal();
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete record');
      }
    }
  };

  return (
    <div className="participations-container">
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
          <button onClick={() => navigate(`/semesters/${semesterId}/groups/${groupId}/persons`)} className="back-button">
            Persons
          </button>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>

      <div className="participations-content">
        <div className="participations-header">
          <div>
            <h1>{person?.name} - Participations</h1>
            <p>{semester?.name} - {group?.groupName}</p>
          </div>
          <button onClick={openCreateModal} className="create-button">
            + Add Participation
          </button>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <div className="loading">Loading data...</div>
        ) : (
          <>
            <div className="books-section">
              <div className="section-header">
                <h2>Assigned Books</h2>
                <button onClick={openBookModal} className="create-button">
                  + Assign Book
                </button>
              </div>

              {semesterUserBooks.length === 0 ? (
                <div className="empty-message">
                  <p>No books assigned yet. Click "Assign Book" to add one.</p>
                </div>
              ) : (
                <div className="books-table-container">
                  <table className="books-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Book Title</th>
                        <th>Author</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {semesterUserBooks.map((userBook) => (
                        <tr key={userBook.id}>
                          <td>{userBook.id}</td>
                          <td>{userBook.book.title}</td>
                          <td>{userBook.book.author}</td>
                          <td>
                            <span className="status-badge">{userBook.status}</span>
                          </td>
                          <td>{userBook.date}</td>
                          <td>
                            <div className="action-buttons">
                              <button
                                onClick={() => openEditBookModal(userBook)}
                                className="edit-btn"
                                title="Edit"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDeleteBook(userBook.id)}
                                className="delete-btn"
                                title="Delete"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="participations-section">
              <h2>Participation Records</h2>
              {participations.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <h3>No participations yet</h3>
                  <p>Create the first participation record</p>
                  <button onClick={openCreateModal} className="create-button">
                    Add Participation
                  </button>
                </div>
              ) : (
                <div className="participations-table-container">
            <table className="participations-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Weekly Record</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {participations.map((participation) => (
                  <tr key={participation.participationId}>
                    <td>{participation.participationId}</td>
                    <td>{participation.participationDate}</td>
                    <td>
                      <span className={`status-badge status-${participation.status.toLowerCase()}`}>
                        {participation.status}
                      </span>
                    </td>
                    <td>
                      {participation.weeklyRecord ? (
                        <div className="record-summary">
                          Week {participation.weeklyRecord.weekNumber} |
                          S1: {participation.weeklyRecord.service1} |
                          S2: {participation.weeklyRecord.service2} |
                          QT: {participation.weeklyRecord.qt}/6 |
                          Reading: {participation.weeklyRecord.reading}/35 |
                          Pray: {participation.weeklyRecord.pray}/7 |
                          Memorize: {participation.weeklyRecord.memorize}/4
                        </div>
                      ) : (
                        <span className="no-record">No record</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => openRecordModal(participation)}
                          className="record-btn"
                          title={participation.weeklyRecord ? "Edit Record" : "Add Record"}
                        >
                          📝
                        </button>
                        <button
                          onClick={() => openEditModal(participation)}
                          className="edit-btn"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(participation.participationId)}
                          className="delete-btn"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
                </div>
              )}
            </div>
          </>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingParticipation ? 'Edit Participation' : 'Add New Participation'}</h2>
                <button onClick={closeModal} className="close-button">
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="participation-form">
                <div className="form-group">
                  <label htmlFor="participationDate">Participation Date *</label>
                  <input
                    type="date"
                    id="participationDate"
                    value={formData.participationDate}
                    onChange={(e) =>
                      setFormData({ ...formData, participationDate: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="status">Status *</label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    required
                  >
                    <option value="ontime">On Time</option>
                    <option value="late">Late</option>
                    <option value="absent">Absent</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={closeModal} className="cancel-btn">
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    {editingParticipation ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showRecordModal && (
          <div className="modal-overlay" onClick={closeRecordModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>
                  {currentParticipation?.weeklyRecord ? 'Edit Weekly Record' : 'Add Weekly Record'}
                </h2>
                <button onClick={closeRecordModal} className="close-button">
                  ×
                </button>
              </div>

              <form onSubmit={handleRecordSubmit} className="record-form">
                <div className="form-group">
                  <label htmlFor="weekNumber">Week Number *</label>
                  <input
                    type="number"
                    id="weekNumber"
                    value={recordFormData.weekNumber}
                    onChange={(e) =>
                      setRecordFormData({ ...recordFormData, weekNumber: parseInt(e.target.value) })
                    }
                    required
                    min="1"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="service1">Service 1 *</label>
                    <select
                      id="service1"
                      value={recordFormData.service1}
                      onChange={(e) =>
                        setRecordFormData({ ...recordFormData, service1: e.target.value })
                      }
                      required
                    >
                      <option value="N/A">N/A</option>
                      <option value="ontime">On Time</option>
                      <option value="late">Late</option>
                      <option value="absent">Absent</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="service2">Service 2 *</label>
                    <select
                      id="service2"
                      value={recordFormData.service2}
                      onChange={(e) =>
                        setRecordFormData({ ...recordFormData, service2: e.target.value })
                      }
                      required
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
                    <label htmlFor="qt">QT (0-6) *</label>
                    <input
                      type="number"
                      id="qt"
                      value={recordFormData.qt}
                      onChange={(e) =>
                        setRecordFormData({ ...recordFormData, qt: parseInt(e.target.value) })
                      }
                      required
                      min="0"
                      max="6"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="reading">Reading (0-35) *</label>
                    <input
                      type="number"
                      id="reading"
                      value={recordFormData.reading}
                      onChange={(e) =>
                        setRecordFormData({ ...recordFormData, reading: parseInt(e.target.value) })
                      }
                      required
                      min="0"
                      max="35"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="pray">Pray (0-7) *</label>
                    <input
                      type="number"
                      id="pray"
                      value={recordFormData.pray}
                      onChange={(e) =>
                        setRecordFormData({ ...recordFormData, pray: parseInt(e.target.value) })
                      }
                      required
                      min="0"
                      max="7"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="memorize">Memorize (0-4) *</label>
                    <input
                      type="number"
                      id="memorize"
                      value={recordFormData.memorize}
                      onChange={(e) =>
                        setRecordFormData({ ...recordFormData, memorize: parseInt(e.target.value) })
                      }
                      required
                      min="0"
                      max="4"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="submittedDate">Submitted Date</label>
                  <input
                    type="date"
                    id="submittedDate"
                    value={recordFormData.submittedDate}
                    onChange={(e) =>
                      setRecordFormData({ ...recordFormData, submittedDate: e.target.value })
                    }
                  />
                </div>

                <div className="modal-actions">
                  {currentParticipation?.weeklyRecord && (
                    <button
                      type="button"
                      onClick={() => handleDeleteRecord(currentParticipation.weeklyRecord.recordId)}
                      className="delete-record-btn"
                    >
                      Delete Record
                    </button>
                  )}
                  <button type="button" onClick={closeRecordModal} className="cancel-btn">
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    {currentParticipation?.weeklyRecord ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showBookModal && (
          <div className="modal-overlay" onClick={closeBookModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingBook ? 'Edit Book Assignment' : 'Assign Book'}</h2>
                <button onClick={closeBookModal} className="close-button">
                  ×
                </button>
              </div>

              <form onSubmit={handleBookSubmit} className="book-form">
                {!editingBook && (
                  <div className="form-group">
                    <label htmlFor="bookId">Book *</label>
                    <select
                      id="bookId"
                      value={bookFormData.bookId}
                      onChange={(e) =>
                        setBookFormData({ ...bookFormData, bookId: e.target.value })
                      }
                      required
                    >
                      <option value="">Select a book...</option>
                      {availableBooks.map((book) => (
                        <option key={book.bookId} value={book.bookId}>
                          {book.title} by {book.author}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="status">Status *</label>
                  <select
                    id="status"
                    value={bookFormData.status}
                    onChange={(e) =>
                      setBookFormData({ ...bookFormData, status: e.target.value })
                    }
                    required
                  >
                    <option value="N/A">N/A</option>
                    <option value="Not submitted">Not submitted</option>
                    <option value="submitted">Submitted</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="date">Date *</label>
                  <input
                    type="date"
                    id="date"
                    value={bookFormData.date}
                    onChange={(e) =>
                      setBookFormData({ ...bookFormData, date: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={closeBookModal} className="cancel-btn">
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    {editingBook ? 'Update' : 'Assign'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Participations;
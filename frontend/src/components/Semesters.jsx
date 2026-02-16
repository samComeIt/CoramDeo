import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import semesterService from '../services/semesterService';
import groupService from '../services/groupService';
import bookService from '../services/bookService';
import authService from '../services/authService';
import './Semesters.css';

function Semesters() {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sdate: '',
    edate: ''
  });
  const [showGroupsModal, setShowGroupsModal] = useState(false);
  const [managingSemester, setManagingSemester] = useState(null);
  const [semesterGroups, setSemesterGroups] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [showBooksModal, setShowBooksModal] = useState(false);
  const [managingBooksSemester, setManagingBooksSemester] = useState(null);
  const [semesterBooks, setSemesterBooks] = useState([]);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState('');
  const navigate = useNavigate();
  const admin = authService.getCurrentAdmin();

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    try {
      setLoading(true);
      const data = await semesterService.getAllSemesters();
      setSemesters(data);
      setError('');
    } catch (err) {
      setError('Failed to load semesters');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const openCreateModal = () => {
    setEditingSemester(null);
    setFormData({ name: '', sdate: '', edate: '' });
    setShowModal(true);
  };

  const openEditModal = (semester) => {
    setEditingSemester(semester);
    setFormData({
      name: semester.name,
      sdate: semester.sdate,
      edate: semester.edate
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSemester(null);
    setFormData({ name: '', sdate: '', edate: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSemester) {
        await semesterService.updateSemester(editingSemester.semesterId, formData);
      } else {
        await semesterService.createSemester(formData);
      }
      fetchSemesters();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save semester');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this semester?')) {
      try {
        await semesterService.deleteSemester(id);
        fetchSemesters();
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete semester');
      }
    }
  };

  const openManageGroupsModal = async (semester) => {
    setManagingSemester(semester);
    try {
      const [groups, allGroups] = await Promise.all([
        semesterService.getSemesterGroups(semester.semesterId),
        groupService.getAllGroups()
      ]);
      setSemesterGroups(Array.from(groups));
      const available = allGroups.filter(
        g => !Array.from(groups).find(sg => sg.groupId === g.groupId)
      );
      setAvailableGroups(available);
      setShowGroupsModal(true);
    } catch (err) {
      setError('Failed to load groups');
      console.error(err);
    }
  };

  const closeGroupsModal = () => {
    setShowGroupsModal(false);
    setManagingSemester(null);
    setSemesterGroups([]);
    setAvailableGroups([]);
    setSelectedGroupId('');
  };

  const handleAddGroup = async () => {
    if (!selectedGroupId) return;
    try {
      await semesterService.addGroupToSemester(managingSemester.semesterId, selectedGroupId);
      await openManageGroupsModal(managingSemester);
      setSelectedGroupId('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add group');
    }
  };

  const handleRemoveGroup = async (groupId) => {
    if (window.confirm('Remove this group from the semester?')) {
      try {
        await semesterService.removeGroupFromSemester(managingSemester.semesterId, groupId);
        await openManageGroupsModal(managingSemester);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to remove group');
      }
    }
  };

  const openManageBooksModal = async (semester) => {
    setManagingBooksSemester(semester);
    try {
      const [books, allBooks] = await Promise.all([
        semesterService.getSemesterBooks(semester.semesterId),
        bookService.getAllBooks()
      ]);
      setSemesterBooks(Array.from(books));
      const available = allBooks.filter(
        b => !Array.from(books).find(sb => sb.bookId === b.bookId)
      );
      setAvailableBooks(available);
      setShowBooksModal(true);
    } catch (err) {
      setError('Failed to load books');
      console.error(err);
    }
  };

  const closeBooksModal = () => {
    setShowBooksModal(false);
    setManagingBooksSemester(null);
    setSemesterBooks([]);
    setAvailableBooks([]);
    setSelectedBookId('');
  };

  const handleAddBook = async () => {
    if (!selectedBookId) return;
    try {
      await semesterService.addBookToSemester(managingBooksSemester.semesterId, selectedBookId);
      await openManageBooksModal(managingBooksSemester);
      setSelectedBookId('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add book');
    }
  };

  const handleRemoveBook = async (bookId) => {
    if (window.confirm('Remove this book from the semester?')) {
      try {
        await semesterService.removeBookFromSemester(managingBooksSemester.semesterId, bookId);
        await openManageBooksModal(managingBooksSemester);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to remove book');
      }
    }
  };

  return (
    <div className="semesters-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h2>Semester Reading Group</h2>
        </div>
        <div className="nav-user">
          <span>Welcome, {admin?.name}</span>
          <button onClick={() => navigate('/dashboard')} className="back-button">
            Dashboard
          </button>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>

      <div className="semesters-content">
        <div className="semesters-header">
          <div>
            <h1>Semesters Management</h1>
            <p>Manage semesters and assign groups</p>
          </div>
          <button onClick={openCreateModal} className="create-button">
            + Create Semester
          </button>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <div className="loading">Loading semesters...</div>
        ) : semesters.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>No semesters yet</h3>
            <p>Create your first semester to get started</p>
            <button onClick={openCreateModal} className="create-button">
              Create Semester
            </button>
          </div>
        ) : (
          <div className="semesters-table-container">
            <table className="semesters-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {semesters.map((semester) => (
                  <tr key={semester.semesterId}>
                    <td>{semester.semesterId}</td>
                    <td className="semester-name">{semester.name}</td>
                    <td>{semester.sdate}</td>
                    <td>{semester.edate}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => navigate(`/semesters/${semester.semesterId}/groups`)}
                          className="view-btn"
                          title="View Groups"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => openManageGroupsModal(semester)}
                          className="manage-btn"
                          title="Manage Groups"
                        >
                          📚
                        </button>
                        <button
                          onClick={() => openManageBooksModal(semester)}
                          className="manage-btn"
                          title="Manage Books"
                        >
                          📖
                        </button>
                        <button
                          onClick={() => openEditModal(semester)}
                          className="edit-btn"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(semester.semesterId)}
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

        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingSemester ? 'Edit Semester' : 'Create New Semester'}</h2>
                <button onClick={closeModal} className="close-button">
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="semester-form">
                <div className="form-group">
                  <label htmlFor="name">Semester Name *</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    placeholder="e.g., Spring 2026"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="sdate">Start Date *</label>
                  <input
                    type="date"
                    id="sdate"
                    value={formData.sdate}
                    onChange={(e) =>
                      setFormData({ ...formData, sdate: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edate">End Date *</label>
                  <input
                    type="date"
                    id="edate"
                    value={formData.edate}
                    onChange={(e) =>
                      setFormData({ ...formData, edate: e.target.value })
                    }
                    required
                  />
                  <small>End date must be after start date</small>
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={closeModal} className="cancel-btn">
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    {editingSemester ? 'Update Semester' : 'Create Semester'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showGroupsModal && (
          <div className="modal-overlay" onClick={closeGroupsModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Manage Groups - {managingSemester?.name}</h2>
                <button onClick={closeGroupsModal} className="close-button">
                  ×
                </button>
              </div>

              <div className="groups-management">
                <div className="add-group-section">
                  <h3>Add Group to Semester</h3>
                  <div className="add-group-form">
                    <select
                      value={selectedGroupId}
                      onChange={(e) => setSelectedGroupId(e.target.value)}
                      className="group-select"
                    >
                      <option value="">Select a group...</option>
                      {availableGroups.map((group) => (
                        <option key={group.groupId} value={group.groupId}>
                          {group.groupName} (ID: {group.groupId})
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAddGroup}
                      disabled={!selectedGroupId}
                      className="add-btn"
                    >
                      Add to Semester
                    </button>
                  </div>
                </div>

                <div className="current-groups-section">
                  <h3>Current Groups ({semesterGroups.length})</h3>
                  {semesterGroups.length === 0 ? (
                    <p className="no-groups">No groups in this semester yet</p>
                  ) : (
                    <table className="groups-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Group Name</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {semesterGroups.map((group) => (
                          <tr key={group.groupId}>
                            <td>{group.groupId}</td>
                            <td>{group.groupName}</td>
                            <td>
                              <button
                                onClick={() => handleRemoveGroup(group.groupId)}
                                className="remove-btn"
                                title="Remove"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button onClick={closeGroupsModal} className="cancel-btn">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showBooksModal && (
          <div className="modal-overlay" onClick={closeBooksModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Manage Books - {managingBooksSemester?.name}</h2>
                <button onClick={closeBooksModal} className="close-button">
                  ×
                </button>
              </div>

              <div className="groups-management">
                <div className="add-group-section">
                  <h3>Add Book to Semester</h3>
                  <div className="add-group-form">
                    <select
                      value={selectedBookId}
                      onChange={(e) => setSelectedBookId(e.target.value)}
                      className="group-select"
                    >
                      <option value="">Select a book...</option>
                      {availableBooks.map((book) => (
                        <option key={book.bookId} value={book.bookId}>
                          {book.title} by {book.author} (ID: {book.bookId})
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAddBook}
                      disabled={!selectedBookId}
                      className="add-btn"
                    >
                      Add to Semester
                    </button>
                  </div>
                </div>

                <div className="current-groups-section">
                  <h3>Current Books ({semesterBooks.length})</h3>
                  {semesterBooks.length === 0 ? (
                    <p className="no-groups">No books in this semester yet</p>
                  ) : (
                    <table className="groups-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Title</th>
                          <th>Author</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {semesterBooks.map((book) => (
                          <tr key={book.bookId}>
                            <td>{book.bookId}</td>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>
                              <button
                                onClick={() => handleRemoveBook(book.bookId)}
                                className="remove-btn"
                                title="Remove"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button onClick={closeBooksModal} className="cancel-btn">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Semesters;
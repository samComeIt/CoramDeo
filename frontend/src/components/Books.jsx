import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bookService from '../services/bookService';
import authService from '../services/authService';
import './Books.css';

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [viewingBook, setViewingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('title');
  const navigate = useNavigate();
  const admin = authService.getCurrentAdmin();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getAllBooks();
      setBooks(data);
      setError('');
    } catch (err) {
      setError('Failed to load books');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchBooks();
      return;
    }

    try {
      setLoading(true);
      let data;
      if (searchType === 'title') {
        data = await bookService.searchBooksByTitle(searchTerm);
      } else {
        data = await bookService.searchBooksByAuthor(searchTerm);
      }
      setBooks(data);
      setError('');
    } catch (err) {
      setError('Failed to search books');
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
    setEditingBook(null);
    setFormData({ title: '', author: '', description: '' });
    setShowModal(true);
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description || ''
    });
    setShowModal(true);
  };

  const openViewModal = (book) => {
    setViewingBook(book);
    setShowViewModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBook(null);
    setFormData({ title: '', author: '', description: '' });
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setViewingBook(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await bookService.updateBook(editingBook.bookId, formData);
      } else {
        await bookService.createBook(formData);
      }
      fetchBooks();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save book');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookService.deleteBook(id);
        fetchBooks();
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete book');
      }
    }
  };

  return (
    <div className="books-container">
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

      <div className="books-content">
        <div className="books-header">
          <div>
            <h1>Books Management</h1>
            <p>Manage your book library</p>
          </div>
          <button onClick={openCreateModal} className="create-button">
            + Add Book
          </button>
        </div>

        <div className="search-section">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="search-type-select"
          >
            <option value="title">Search by Title</option>
            <option value="author">Search by Author</option>
          </select>
          <input
            type="text"
            placeholder={`Search by ${searchType}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
          <button onClick={() => { setSearchTerm(''); fetchBooks(); }} className="clear-button">
            Clear
          </button>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <div className="loading">Loading books...</div>
        ) : books.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No books yet</h3>
            <p>Add your first book to get started</p>
            <button onClick={openCreateModal} className="create-button">
              Add Book
            </button>
          </div>
        ) : (
          <div className="books-table-container">
            <table className="books-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.bookId}>
                    <td>{book.bookId}</td>
                    <td className="book-title">{book.title}</td>
                    <td>{book.author}</td>
                    <td className="book-description">
                      {book.description ? (
                        book.description.length > 50
                          ? book.description.substring(0, 50) + '...'
                          : book.description
                      ) : (
                        <span className="no-description">No description</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => openViewModal(book)}
                          className="view-btn"
                          title="View"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => openEditModal(book)}
                          className="edit-btn"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(book.bookId)}
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
                <h2>{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
                <button onClick={closeModal} className="close-button">
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="book-form">
                <div className="form-group">
                  <label htmlFor="title">Title *</label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    placeholder="e.g., Clean Code"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="author">Author *</label>
                  <input
                    type="text"
                    id="author"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    required
                    placeholder="e.g., Robert C. Martin"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows="4"
                    placeholder="Enter book description..."
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={closeModal} className="cancel-btn">
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    {editingBook ? 'Update Book' : 'Add Book'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showViewModal && viewingBook && (
          <div className="modal-overlay" onClick={closeViewModal}>
            <div className="modal-content view-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Book Details</h2>
                <button onClick={closeViewModal} className="close-button">
                  ×
                </button>
              </div>

              <div className="book-view-content">
                <div className="view-field">
                  <label>ID:</label>
                  <p>{viewingBook.bookId}</p>
                </div>

                <div className="view-field">
                  <label>Title:</label>
                  <p className="view-title">{viewingBook.title}</p>
                </div>

                <div className="view-field">
                  <label>Author:</label>
                  <p>{viewingBook.author}</p>
                </div>

                <div className="view-field">
                  <label>Description:</label>
                  <p className="view-description">
                    {viewingBook.description || 'No description available'}
                  </p>
                </div>
              </div>

              <div className="modal-actions">
                <button onClick={closeViewModal} className="cancel-btn">
                  Close
                </button>
                <button
                  onClick={() => {
                    closeViewModal();
                    openEditModal(viewingBook);
                  }}
                  className="submit-btn"
                >
                  Edit Book
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Books;
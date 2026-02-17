import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import personService from '../services/personService';
import authService from '../services/authService';
import './Persons.css';

function Persons() {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    password: ''
  });
  const navigate = useNavigate();
  const admin = authService.getCurrentAdmin();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const personsData = await personService.getAllPersons();
      setPersons(personsData);
      setError('');
    } catch (err) {
      setError('Failed to load data');
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
    setEditingPerson(null);
    setFormData({ name: '', password: '' });
    setShowModal(true);
  };

  const openEditModal = (person) => {
    setEditingPerson(person);
    setFormData({
      name: person.name,
      password: ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPerson(null);
    setFormData({ name: '', password: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPerson) {
        await personService.updatePerson(editingPerson.personId, {
          name: formData.name,
          password: formData.password
        });
      } else {
        await personService.createPerson({
          name: formData.name,
          password: formData.password
        });
      }
      fetchData();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save person');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this person?')) {
      try {
        await personService.deletePerson(id);
        fetchData();
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete person');
      }
    }
  };

  return (
    <div className="persons-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h2>Coram Deo</h2>
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

      <div className="persons-content">
        <div className="persons-header">
          <div>
            <h1>Persons Management</h1>
            <p>Manage participants in reading groups</p>
          </div>
          <button onClick={openCreateModal} className="create-button">
            + Add Person
          </button>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <div className="loading">Loading persons...</div>
        ) : persons.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👤</div>
            <h3>No persons found</h3>
            <p>Add your first person to get started</p>
            <button onClick={openCreateModal} className="create-button">
              Add Person
            </button>
          </div>
        ) : (
          <div className="persons-table-container">
            <table className="persons-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {persons.map((person) => (
                  <tr key={person.personId}>
                    <td>{person.personId}</td>
                    <td className="person-name">{person.name}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => openEditModal(person)}
                          className="edit-btn"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(person.personId)}
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
                <h2>{editingPerson ? 'Edit Person' : 'Add New Person'}</h2>
                <button onClick={closeModal} className="close-button">
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="person-form">
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    placeholder="e.g., John Doe"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password *</label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    placeholder="Enter password"
                  />
                  <small>Enter a secure password</small>
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={closeModal} className="cancel-btn">
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    {editingPerson ? 'Update Person' : 'Add Person'}
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

export default Persons;
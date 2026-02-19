import { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import './Admins.css';

function Admins() {
  const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  const [deletedAdmins, setDeletedAdmins] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    username: '',
    name: '',
    password: '',
    type: 'admin'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllAdmins();
      setAdmins(data);
      setError('');
    } catch (error) {
      setError('Failed to load admins: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const loadDeletedAdmins = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDeletedAdmins();
      setDeletedAdmins(data);
      setShowDeletedModal(true);
      setError('');
    } catch (error) {
      setError('Failed to load deleted admins: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (formData.id) {
        await adminService.updateAdmin(formData);
      } else {
        await adminService.createAdmin(formData);
      }
      setShowModal(false);
      loadAdmins();
      resetForm();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save admin');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this admin? (Soft delete)')) {
      try {
        setLoading(true);
        await adminService.deleteAdmin(id);
        loadAdmins();
        setError('');
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete admin');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRestore = async (id) => {
    if (window.confirm('Are you sure you want to restore this admin?')) {
      try {
        setLoading(true);
        await adminService.restoreAdmin(id);
        loadDeletedAdmins();
        loadAdmins();
        setError('');
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to restore admin');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({ id: null, username: '', name: '', password: '', type: 'admin' });
  };

  const openEditModal = (admin) => {
    setFormData({
      id: admin.id,
      username: admin.username,
      name: admin.name,
      password: '', // Don't populate password for security
      type: admin.type
    });
    setShowModal(true);
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'N/A';
    const date = new Date(dateTime);
    return date.toLocaleString();
  };

  return (
    <div className="admins-container">
      <div className="admins-header">
        <h1>Admin Management</h1>
        <div className="header-buttons">
          <button onClick={loadDeletedAdmins} className="btn-secondary">
            View Deleted Admins
          </button>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            Create Admin
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading && <div className="loading">Loading...</div>}

      <div className="admins-table-container">
        <table className="admins-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Name</th>
              <th>Type</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin.id}>
                <td>{admin.id}</td>
                <td>{admin.username}</td>
                <td>{admin.name}</td>
                <td>
                  <span className={`badge badge-${admin.type}`}>
                    {admin.type}
                  </span>
                </td>
                <td>{formatDateTime(admin.createdAt)}</td>
                <td>{formatDateTime(admin.updatedAt)}</td>
                <td>
                  <button
                    onClick={() => openEditModal(admin)}
                    className="btn-edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(admin.id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {admins.length === 0 && !loading && (
          <div className="no-data">No admins found</div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); resetForm(); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{formData.id ? 'Edit Admin' : 'Create Admin'}</h2>
              <button
                className="modal-close"
                onClick={() => { setShowModal(false); resetForm(); }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  minLength={3}
                  placeholder="Min 3 characters"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Display Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  minLength={2}
                  placeholder="Min 2 characters"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Password * {formData.id && '(Leave blank to keep current)'}</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!formData.id}
                  minLength={8}
                  placeholder="Min 8 characters"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                  disabled={loading}
                >
                  <option value="superadmin">Superadmin</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="btn-cancel"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (formData.id ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deleted Admins Modal */}
      {showDeletedModal && (
        <div className="modal-overlay" onClick={() => setShowDeletedModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Deleted Admins</h2>
              <button
                className="modal-close"
                onClick={() => setShowDeletedModal(false)}
              >
                ×
              </button>
            </div>

            <div className="deleted-admins-list">
              <table className="admins-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Deleted At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deletedAdmins.map(admin => (
                    <tr key={admin.id}>
                      <td>{admin.id}</td>
                      <td>{admin.username}</td>
                      <td>{admin.name}</td>
                      <td>
                        <span className={`badge badge-${admin.type}`}>
                          {admin.type}
                        </span>
                      </td>
                      <td>{formatDateTime(admin.updatedAt)}</td>
                      <td>
                        <button
                          onClick={() => handleRestore(admin.id)}
                          className="btn-restore"
                        >
                          Restore
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {deletedAdmins.length === 0 && (
                <div className="no-data">No deleted admins found</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admins;
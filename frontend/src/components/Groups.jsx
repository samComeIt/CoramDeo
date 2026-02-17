import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import groupService from '../services/groupService';
import personService from '../services/personService';
import authService from '../services/authService';
import './Groups.css';

function Groups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [formData, setFormData] = useState({
    groupName: ''
  });
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [managingGroup, setManagingGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [availablePersons, setAvailablePersons] = useState([]);
  const [selectedPersonId, setSelectedPersonId] = useState('');
  const navigate = useNavigate();
  const admin = authService.getCurrentAdmin();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const data = await groupService.getAllGroups();
      setGroups(data);
      setError('');
    } catch (err) {
      setError('Failed to load groups');
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
    setEditingGroup(null);
    setFormData({ groupName: '' });
    setShowModal(true);
  };

  const openEditModal = (group) => {
    setEditingGroup(group);
    setFormData({
      groupName: group.groupName
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingGroup(null);
    setFormData({ groupName: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGroup) {
        await groupService.updateGroup(editingGroup.groupId, formData);
      } else {
        await groupService.createGroup(formData);
      }
      fetchGroups();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save group');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      try {
        await groupService.deleteGroup(id);
        fetchGroups();
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete group');
      }
    }
  };

  const openManagePersonsModal = async (group) => {
    setManagingGroup(group);
    try {
      const [membersData, allPersons] = await Promise.all([
        groupService.getGroupMembers(group.groupId),
        personService.getAllPersons()
      ]);
      setMembers(membersData);
      const available = allPersons.filter(
        p => !membersData.find(m => m.personId === p.personId)
      );
      setAvailablePersons(available);
      setShowMembersModal(true);
    } catch (err) {
      setError('Failed to load persons');
      console.error(err);
    }
  };

  const closeMembersModal = () => {
    setShowMembersModal(false);
    setManagingGroup(null);
    setMembers([]);
    setAvailablePersons([]);
    setSelectedPersonId('');
  };

  const handleAddPerson = async () => {
    if (!selectedPersonId) return;
    try {
      await groupService.addPersonToGroup(managingGroup.groupId, selectedPersonId);
      await openManagePersonsModal(managingGroup);
      setSelectedPersonId('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add person');
    }
  };

  const handleRemovePerson = async (personId) => {
    if (window.confirm('Remove this person from the group?')) {
      try {
        await groupService.removePersonFromGroup(managingGroup.groupId, personId);
        await openManagePersonsModal(managingGroup);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to remove person');
      }
    }
  };

  return (
    <div className="groups-container">
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

      <div className="groups-content">
        <div className="groups-header">
          <div>
            <h1>Groups Management</h1>
            <p>Manage reading groups and add persons to groups</p>
          </div>
          <button onClick={openCreateModal} className="create-button">
            + Create Group
          </button>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <div className="loading">Loading groups...</div>
        ) : groups.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No groups yet</h3>
            <p>Create your first reading group to get started</p>
            <button onClick={openCreateModal} className="create-button">
              Create Group
            </button>
          </div>
        ) : (
          <div className="groups-table-container">
            <table className="groups-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Group Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group) => (
                  <tr key={group.groupId}>
                    <td>{group.groupId}</td>
                    <td className="group-name">{group.groupName}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => openManagePersonsModal(group)}
                          className="manage-btn"
                          title="Manage Persons"
                        >
                          👥
                        </button>
                        <button
                          onClick={() => openEditModal(group)}
                          className="edit-btn"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(group.groupId)}
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
                <h2>{editingGroup ? 'Edit Group' : 'Create New Group'}</h2>
                <button onClick={closeModal} className="close-button">
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="group-form">
                <div className="form-group">
                  <label htmlFor="groupName">Group Name *</label>
                  <input
                    type="text"
                    id="groupName"
                    value={formData.groupName}
                    onChange={(e) =>
                      setFormData({ ...formData, groupName: e.target.value })
                    }
                    required
                    placeholder="e.g., Spring 2026 Reading Group"
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={closeModal} className="cancel-btn">
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    {editingGroup ? 'Update Group' : 'Create Group'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showMembersModal && (
          <div className="modal-overlay" onClick={closeMembersModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Manage Persons - {managingGroup?.groupName}</h2>
                <button onClick={closeMembersModal} className="close-button">
                  ×
                </button>
              </div>

              <div className="members-management">
                <div className="add-person-section">
                  <h3>Add Person to Group</h3>
                  <div className="add-person-form">
                    <select
                      value={selectedPersonId}
                      onChange={(e) => setSelectedPersonId(e.target.value)}
                      className="person-select"
                    >
                      <option value="">Select a person...</option>
                      {availablePersons.map((person) => (
                        <option key={person.personId} value={person.personId}>
                          {person.name} (ID: {person.personId})
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAddPerson}
                      disabled={!selectedPersonId}
                      className="add-btn"
                    >
                      Add to Group
                    </button>
                  </div>
                </div>

                <div className="current-members-section">
                  <h3>Current Members ({members.length})</h3>
                  {members.length === 0 ? (
                    <p className="no-members">No members in this group yet</p>
                  ) : (
                    <table className="members-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((member) => (
                          <tr key={member.personId}>
                            <td>{member.personId}</td>
                            <td>{member.name}</td>
                            <td>
                              <button
                                onClick={() => handleRemovePerson(member.personId)}
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
                <button onClick={closeMembersModal} className="cancel-btn">
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

export default Groups;
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
  const [formData, setFormData] = useState({ groupName: '' });
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [managingGroup, setManagingGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [availablePersons, setAvailablePersons] = useState([]);
  const [selectedPersonId, setSelectedPersonId] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
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
    setFormData({ groupName: group.groupName });
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
    setMemberSearch('');
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
    setMemberSearch('');
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

  const getInitials = (name) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const avatarColors = [
    '#667eea', '#764ba2', '#f093fb', '#4facfe',
    '#43e97b', '#fa709a', '#fee140', '#30cfd0'
  ];
  const getAvatarColor = (id) => avatarColors[id % avatarColors.length];

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(memberSearch.toLowerCase())
  );

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
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading groups...</p>
          </div>
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
          <div className="groups-grid">
            {groups.map((group) => (
              <div key={group.groupId} className="group-card">
                <div className="group-card-top">
                  <div className="group-icon">📚</div>
                  <div className="group-info">
                    <h3 className="group-name">{group.groupName}</h3>
                    <span className="group-id">ID #{group.groupId}</span>
                  </div>
                </div>
                <div className="group-card-actions">
                  <button
                    onClick={() => openManagePersonsModal(group)}
                    className="card-members-btn"
                  >
                    Members
                  </button>
                  <button
                    onClick={() => openEditModal(group)}
                    className="card-edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(group.groupId)}
                    className="card-delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Group Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingGroup ? 'Edit Group' : 'Create New Group'}</h2>
              <button onClick={closeModal} className="close-button">×</button>
            </div>

            <form onSubmit={handleSubmit} className="group-form">
              <div className="form-group">
                <label htmlFor="groupName">Group Name *</label>
                <input
                  type="text"
                  id="groupName"
                  value={formData.groupName}
                  onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
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

      {/* Manage Members Modal */}
      {showMembersModal && (
        <div className="modal-overlay" onClick={closeMembersModal}>
          <div className="modal-content members-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-info">
                <h2>{managingGroup?.groupName}</h2>
                <span className="members-count-badge">{members.length} member{members.length !== 1 ? 's' : ''}</span>
              </div>
              <button onClick={closeMembersModal} className="close-button">×</button>
            </div>

            {/* Add Person */}
            <div className="add-person-section">
              <h3>Add Person</h3>
              {availablePersons.length === 0 ? (
                <p className="no-available">All persons are already in this group.</p>
              ) : (
                <div className="add-person-row">
                  <select
                    value={selectedPersonId}
                    onChange={(e) => setSelectedPersonId(e.target.value)}
                    className="person-select"
                  >
                    <option value="">Select a person...</option>
                    {availablePersons.map((person) => (
                      <option key={person.personId} value={person.personId}>
                        {person.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddPerson}
                    disabled={!selectedPersonId}
                    className="add-btn"
                  >
                    + Add
                  </button>
                </div>
              )}
            </div>

            {/* Current Members */}
            <div className="current-members-section">
              <div className="members-section-header">
                <h3>Current Members</h3>
                {members.length > 3 && (
                  <div className="member-search-box">
                    <span>🔍</span>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {members.length === 0 ? (
                <div className="no-members">
                  <span>👤</span>
                  <p>No members yet. Add someone above.</p>
                </div>
              ) : filteredMembers.length === 0 ? (
                <p className="no-members-text">No results for "{memberSearch}"</p>
              ) : (
                <div className="members-list">
                  {filteredMembers.map((member) => (
                    <div key={member.personId} className="member-row">
                      <div
                        className="member-avatar"
                        style={{ background: getAvatarColor(member.personId) }}
                      >
                        {getInitials(member.name)}
                      </div>
                      <div className="member-details">
                        <span className="member-name">{member.name}</span>
                        <span className="member-id">ID #{member.personId}</span>
                      </div>
                      <button
                        onClick={() => handleRemovePerson(member.personId)}
                        className="remove-btn"
                        title="Remove from group"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button onClick={closeMembersModal} className="submit-btn">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Groups;
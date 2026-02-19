import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { participationService } from '../services/participationService';
import semesterService from '../services/semesterService';
import groupService from '../services/groupService';
import personService from '../services/personService';
import authService from '../services/authService';
import './AdminParticipations.css';

function AdminParticipations() {
  const navigate = useNavigate();
  const [participations, setParticipations] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [groups, setGroups] = useState([]);
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if current admin is superadmin
  const currentAdmin = authService.getCurrentAdmin();
  const isSuperAdmin = currentAdmin?.type === 'superadmin';

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  // Get default date range (current month)
  const getDefaultDateRange = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return {
      startDate: firstDay.toISOString().split('T')[0],
      endDate: lastDay.toISOString().split('T')[0]
    };
  };

  // Filter state
  const [filters, setFilters] = useState({
    semesterId: '',
    groupId: '',
    personId: '',
    status: '',
    ...getDefaultDateRange()
  });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    semesterId: '',
    groupId: '',
    personId: '',
    status: 'ontime',
    participationDate: ''
  });

  useEffect(() => {
    loadParticipations();
    loadFilterData();
  }, [currentPage, pageSize]);

  const loadFilterData = async () => {
    try {
      const [semestersData, groupsData, personsData] = await Promise.all([
        semesterService.getAllSemesters(),
        groupService.getAllGroups(),
        personService.getAllPersons()
      ]);
      setSemesters(semestersData);
      setGroups(groupsData);
      setPersons(personsData);
    } catch (error) {
      console.error('Error loading filter data:', error);
    }
  };

  const loadParticipations = async () => {
    try {
      setLoading(true);
      setError('');

      // Validate required date fields
      if (!filters.startDate || !filters.endDate) {
        setError('Start date and end date are required');
        setLoading(false);
        return;
      }

      // Validate date range
      if (new Date(filters.startDate) > new Date(filters.endDate)) {
        setError('Start date must not be after end date');
        setLoading(false);
        return;
      }

      // Always use search endpoint with required dates
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );

      const data = await participationService.searchParticipations(
        cleanFilters,
        currentPage,
        pageSize,
        'participationDate,desc'
      );

      setParticipations(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      setError('Failed to load participations: ' + (error.response?.data?.error || error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    setCurrentPage(0);
    loadParticipations();
  };

  const handleClearFilters = () => {
    setFilters({
      semesterId: '',
      groupId: '',
      personId: '',
      status: '',
      ...getDefaultDateRange()
    });
    setCurrentPage(0);
  };

  // Remove the auto-reload effect since dates are always required
  // useEffect(() => {
  //   if (Object.values(filters).every(value => value === '')) {
  //     loadParticipations();
  //   }
  // }, [filters]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this participation?')) {
      try {
        setLoading(true);
        await participationService.deleteParticipation(id);
        loadParticipations();
        setError('');
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete participation');
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(0);
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'ontime':
        return 'badge-ontime';
      case 'late':
        return 'badge-late';
      case 'absent':
        return 'badge-absent';
      default:
        return 'badge-default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="admin-participations-container">
      <div className="participations-header">
        <div>
          <h1>Participation Management</h1>
          <p className="subtitle">View and manage all participations with advanced filtering</p>
        </div>
        <button onClick={() => navigate('/dashboard')} className="btn-secondary">
          Back to Dashboard
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Filters Section */}
      <div className="filters-section">
        <h3>Filters</h3>
        <div className="filters-grid">
          <div className="filter-group">
            <label>Semester</label>
            <select
              name="semesterId"
              value={filters.semesterId}
              onChange={handleFilterChange}
            >
              <option value="">All Semesters</option>
              {semesters.map(semester => (
                <option key={semester.semesterId} value={semester.semesterId}>
                  {semester.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Group</label>
            <select
              name="groupId"
              value={filters.groupId}
              onChange={handleFilterChange}
            >
              <option value="">All Groups</option>
              {groups.map(group => (
                <option key={group.groupId} value={group.groupId}>
                  {group.groupName}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Person</label>
            <select
              name="personId"
              value={filters.personId}
              onChange={handleFilterChange}
            >
              <option value="">All Persons</option>
              {persons.map(person => (
                <option key={person.personId} value={person.personId}>
                  {person.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Status</option>
              <option value="ontime">On Time</option>
              <option value="late">Late</option>
              <option value="absent">Absent</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Start Date <span className="required">*</span></label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              required
            />
          </div>

          <div className="filter-group">
            <label>End Date <span className="required">*</span></label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              required
            />
          </div>
        </div>

        <div className="filter-actions">
          <button onClick={handleApplyFilters} className="btn-primary">
            Apply Filters
          </button>
          <button onClick={handleClearFilters} className="btn-secondary">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Pagination Info and Controls */}
      <div className="pagination-info">
        <div className="info-text">
          Showing {participations.length > 0 ? (currentPage * pageSize) + 1 : 0} to{' '}
          {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} participations
        </div>
        <div className="page-size-control">
          <label>Items per page:</label>
          <select value={pageSize} onChange={handlePageSizeChange}>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>

      {loading && <div className="loading">Loading...</div>}

      {/* Participations Table */}
      <div className="participations-table-container">
        <table className="participations-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Semester</th>
              <th>Group</th>
              <th>Person</th>
              <th>Week #</th>
              <th>Date</th>
              <th>Status</th>
              <th>Fine</th>
              {isSuperAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {participations.map(participation => (
              <tr key={participation.participationId}>
                <td>{participation.participationId}</td>
                <td>{participation.semester?.name || participation.semesterName || 'N/A'}</td>
                <td>{participation.group?.groupName || participation.groupName || 'N/A'}</td>
                <td>{participation.person?.name || participation.personName || 'N/A'}</td>
                <td className="week-number">
                  {participation.weeklyRecord?.weekNumber || '-'}
                </td>
                <td>{formatDate(participation.participationDate)}</td>
                <td>
                  <span className={`badge ${getStatusBadgeClass(participation.status)}`}>
                    {participation.status}
                  </span>
                </td>
                <td className="fine-amount">
                  {participation.weeklyRecord?.fine !== undefined ?
                    `₩${participation.weeklyRecord.fine.toLocaleString()}` : '-'}
                </td>
                {isSuperAdmin && (
                  <td>
                    <button
                      onClick={() => navigate(`/semesters/${participation.semester?.semesterId || participation.semesterId}/groups/${participation.group?.groupId || participation.groupId}/persons/${participation.person?.personId || participation.personId}/participations`)}
                      className="btn-view"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDelete(participation.participationId)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {participations.length === 0 && !loading && (
          <div className="no-data">No participations found</div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => handlePageChange(0)}
            disabled={currentPage === 0}
            className="btn-page"
          >
            First
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="btn-page"
          >
            Previous
          </button>

          <div className="page-numbers">
            {[...Array(Math.min(5, totalPages))].map((_, index) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = index;
              } else if (currentPage < 3) {
                pageNum = index;
              } else if (currentPage >= totalPages - 3) {
                pageNum = totalPages - 5 + index;
              } else {
                pageNum = currentPage - 2 + index;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`btn-page ${currentPage === pageNum ? 'active' : ''}`}
                >
                  {pageNum + 1}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className="btn-page"
          >
            Next
          </button>
          <button
            onClick={() => handlePageChange(totalPages - 1)}
            disabled={currentPage >= totalPages - 1}
            className="btn-page"
          >
            Last
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminParticipations;
import api from './apiService';

export const participationService = {
  // Get all participations with pagination
  getAllParticipations: async (page = 0, size = 20, sort = 'participationDate,desc') => {
    const response = await api.get('/admin/participations', {
      params: { page, size, sort }
    });
    return response.data;
  },

  // Get participation by ID
  getParticipationById: async (id) => {
    const response = await api.get(`/admin/participations/${id}`);
    return response.data;
  },

  // Get participations by semester with pagination
  getParticipationsBySemester: async (semesterId, page = 0, size = 20) => {
    const response = await api.get(`/admin/participations/semester/${semesterId}`, {
      params: { page, size }
    });
    return response.data;
  },

  // Get participations by group with pagination
  getParticipationsByGroup: async (groupId, page = 0, size = 20) => {
    const response = await api.get(`/admin/participations/group/${groupId}`, {
      params: { page, size }
    });
    return response.data;
  },

  // Get participations by person with pagination
  getParticipationsByPerson: async (personId, page = 0, size = 20) => {
    const response = await api.get(`/admin/participations/person/${personId}`, {
      params: { page, size }
    });
    return response.data;
  },

  // Search participations with filters and pagination
  searchParticipations: async (filters, page = 0, size = 20, sort = 'participationDate,desc') => {
    const response = await api.get('/admin/participations/search', {
      params: { ...filters, page, size, sort }
    });
    return response.data;
  },

  // Create participation
  createParticipation: async (semesterId, groupId, personId, participationData) => {
    const response = await api.post(
      `/admin/participations?semesterId=${semesterId}&groupId=${groupId}&personId=${personId}`,
      participationData
    );
    return response.data;
  },

  // Update participation
  updateParticipation: async (id, participationData) => {
    const response = await api.put(`/admin/participations/${id}`, participationData);
    return response.data;
  },

  // Delete participation
  deleteParticipation: async (id) => {
    const response = await api.delete(`/admin/participations/${id}`);
    return response.data;
  }
};
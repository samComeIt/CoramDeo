import api from './apiService';

export const participationService = {
  getAllParticipations: async () => {
    const response = await api.get('/admin/participations');
    return response.data;
  },

  getParticipationById: async (id) => {
    const response = await api.get(`/admin/participations/${id}`);
    return response.data;
  },

  getParticipationsBySemester: async (semesterId) => {
    const response = await api.get(`/admin/participations/semester/${semesterId}`);
    return response.data;
  },

  getParticipationsByGroup: async (groupId) => {
    const response = await api.get(`/admin/participations/group/${groupId}`);
    return response.data;
  },

  getParticipationsByPerson: async (personId) => {
    const response = await api.get(`/admin/participations/person/${personId}`);
    return response.data;
  },

  createParticipation: async (semesterId, groupId, personId, participationData) => {
    const response = await api.post(
      `/admin/participations?semesterId=${semesterId}&groupId=${groupId}&personId=${personId}`,
      participationData
    );
    return response.data;
  },

  updateParticipation: async (id, participationData) => {
    const response = await api.put(`/admin/participations/${id}`, participationData);
    return response.data;
  },

  deleteParticipation: async (id) => {
    const response = await api.delete(`/admin/participations/${id}`);
    return response.data;
  }
};
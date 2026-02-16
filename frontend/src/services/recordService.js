import api from './apiService';

export const recordService = {
  getAllRecords: async () => {
    const response = await api.get('/admin/records');
    return response.data;
  },

  getRecordById: async (id) => {
    const response = await api.get(`/admin/records/${id}`);
    return response.data;
  },

  getRecordsByPerson: async (personId) => {
    const response = await api.get(`/admin/records/person/${personId}`);
    return response.data;
  },

  getRecordsBySemester: async (semesterId) => {
    const response = await api.get(`/admin/records/semester/${semesterId}`);
    return response.data;
  },

  getRecordsByPersonAndSemester: async (personId, semesterId) => {
    const response = await api.get(`/admin/records/person/${personId}/semester/${semesterId}`);
    return response.data;
  },

  createRecord: async (participationId, recordData) => {
    const response = await api.post(`/admin/records?participationId=${participationId}`, recordData);
    return response.data;
  },

  updateRecord: async (id, recordData) => {
    const response = await api.put(`/admin/records/${id}`, recordData);
    return response.data;
  },

  deleteRecord: async (id) => {
    const response = await api.delete(`/admin/records/${id}`);
    return response.data;
  }
};
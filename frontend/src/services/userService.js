import api from './apiService';

const userService = {
  getUserSemesters: async (personId) => {
    const response = await api.get(`/user/${personId}/semesters`);
    return response.data;
  },

  getUserParticipations: async (personId, semesterId = null, groupId = null) => {
    let url = `/user/${personId}/participations`;
    const params = new URLSearchParams();

    if (semesterId) params.append('semesterId', semesterId);
    if (groupId) params.append('groupId', groupId);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await api.get(url);
    return response.data;
  },

  updateWeeklyRecord: async (participationId, recordData) => {
    const response = await api.put(`/user/participations/${participationId}/record`, recordData);
    return response.data;
  }
};

export default userService;
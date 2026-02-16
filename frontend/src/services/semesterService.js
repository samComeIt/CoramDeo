import api from './apiService';

class SemesterService {
  async getAllSemesters() {
    const response = await api.get('/admin/semesters');
    return response.data;
  }

  async getSemesterById(id) {
    const response = await api.get(`/admin/semesters/${id}`);
    return response.data;
  }

  async createSemester(semesterData) {
    const response = await api.post('/admin/semesters', semesterData);
    return response.data;
  }

  async updateSemester(id, semesterData) {
    const response = await api.put(`/admin/semesters/${id}`, semesterData);
    return response.data;
  }

  async deleteSemester(id) {
    const response = await api.delete(`/admin/semesters/${id}`);
    return response.data;
  }

  async getSemesterGroups(id) {
    const response = await api.get(`/admin/semesters/${id}/groups`);
    return response.data;
  }

  async addGroupToSemester(semesterId, groupId) {
    const response = await api.post(`/admin/semesters/${semesterId}/groups?groupId=${groupId}`);
    return response.data;
  }

  async removeGroupFromSemester(semesterId, groupId) {
    const response = await api.delete(`/admin/semesters/${semesterId}/groups/${groupId}`);
    return response.data;
  }

  async getSemesterBooks(id) {
    const response = await api.get(`/admin/semesters/${id}/books`);
    return response.data;
  }

  async addBookToSemester(semesterId, bookId) {
    const response = await api.post(`/admin/semesters/${semesterId}/books?bookId=${bookId}`);
    return response.data;
  }

  async removeBookFromSemester(semesterId, bookId) {
    const response = await api.delete(`/admin/semesters/${semesterId}/books/${bookId}`);
    return response.data;
  }
}

export default new SemesterService();
import api from './apiService';

class SemesterUserBookService {
  async getAllSemesterUserBooks() {
    const response = await api.get('/admin/semester-user-books');
    return response.data;
  }

  async getSemesterUserBookById(id) {
    const response = await api.get(`/admin/semester-user-books/${id}`);
    return response.data;
  }

  async getSemesterUserBooksBySemester(semesterId) {
    const response = await api.get(`/admin/semester-user-books/semester/${semesterId}`);
    return response.data;
  }

  async getSemesterUserBooksByPerson(personId) {
    const response = await api.get(`/admin/semester-user-books/person/${personId}`);
    return response.data;
  }

  async getSemesterUserBooksByBook(bookId) {
    const response = await api.get(`/admin/semester-user-books/book/${bookId}`);
    return response.data;
  }

  async getSemesterUserBooksBySemesterAndPerson(semesterId, personId) {
    const response = await api.get(`/admin/semester-user-books/semester/${semesterId}/person/${personId}`);
    return response.data;
  }

  async getSemesterUserBooksBySemesterAndBook(semesterId, bookId) {
    const response = await api.get(`/admin/semester-user-books/semester/${semesterId}/book/${bookId}`);
    return response.data;
  }

  async createSemesterUserBook(semesterId, personId, bookId, data) {
    const response = await api.post(
      `/admin/semester-user-books?semesterId=${semesterId}&personId=${personId}&bookId=${bookId}`,
      data
    );
    return response.data;
  }

  async updateSemesterUserBook(id, data) {
    const response = await api.put(`/admin/semester-user-books/${id}`, data);
    return response.data;
  }

  async deleteSemesterUserBook(id) {
    const response = await api.delete(`/admin/semester-user-books/${id}`);
    return response.data;
  }
}

export default new SemesterUserBookService();
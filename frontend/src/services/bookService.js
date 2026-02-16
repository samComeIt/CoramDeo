import api from './apiService';

class BookService {
  async getAllBooks() {
    const response = await api.get('/admin/books');
    return response.data;
  }

  async getBookById(id) {
    const response = await api.get(`/admin/books/${id}`);
    return response.data;
  }

  async searchBooksByTitle(keyword) {
    const response = await api.get(`/admin/books/search/title?keyword=${keyword}`);
    return response.data;
  }

  async searchBooksByAuthor(keyword) {
    const response = await api.get(`/admin/books/search/author?keyword=${keyword}`);
    return response.data;
  }

  async createBook(bookData) {
    const response = await api.post('/admin/books', bookData);
    return response.data;
  }

  async updateBook(id, bookData) {
    const response = await api.put(`/admin/books/${id}`, bookData);
    return response.data;
  }

  async deleteBook(id) {
    const response = await api.delete(`/admin/books/${id}`);
    return response.data;
  }
}

export default new BookService();

import api from './apiService';

class AuthService {
  async login(username, password) {
    const response = await api.post('/auth/login', {
      username,
      password
    });

    if (response.data.token) {
      localStorage.setItem('admin', JSON.stringify(response.data));
    }

    return response.data;
  }

  logout() {
    localStorage.removeItem('admin');
  }

  async register(username, name, password) {
    const response = await api.post('/auth/register', {
      username,
      name,
      password
    });
    return response.data;
  }

  getCurrentAdmin() {
    const admin = localStorage.getItem('admin');
    return admin ? JSON.parse(admin) : null;
  }

  getToken() {
    const admin = this.getCurrentAdmin();
    return admin ? admin.token : null;
  }

  isAuthenticated() {
    return this.getToken() !== null;
  }
}

export default new AuthService();
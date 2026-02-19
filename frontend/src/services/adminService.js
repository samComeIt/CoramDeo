import api from './apiService';

class AdminService {
  // Get all active admins (is_delete = false)
  async getAllAdmins() {
    const response = await api.get('/admin/list');
    return response.data;
  }

  // Get admin by ID
  async getAdminById(id) {
    const response = await api.get(`/admin/${id}`);
    return response.data;
  }

  // Create admin
  async createAdmin(adminData) {
    const response = await api.post('/admin/create', adminData);
    return response.data;
  }

  // Update admin
  async updateAdmin(adminData) {
    const response = await api.put('/admin/update', adminData);
    return response.data;
  }

  // Soft delete admin
  async deleteAdmin(id) {
    const response = await api.delete(`/admin/delete/${id}`);
    return response.data;
  }

  // Login admin (alternative to authService)
  async loginAdmin(username, password) {
    const response = await api.post('/admin/login', {
      username,
      password
    });
    return response.data;
  }

  // Restore deleted admin
  async restoreAdmin(id) {
    const response = await api.put(`/admin/restore/${id}`);
    return response.data;
  }

  // Get all deleted admins
  async getDeletedAdmins() {
    const response = await api.get('/admin/deleted');
    return response.data;
  }
}

export default new AdminService();
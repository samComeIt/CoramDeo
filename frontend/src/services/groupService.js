import api from './apiService';

class GroupService {
  async getAllGroups() {
    const response = await api.get('/admin/groups');
    return response.data;
  }

  async getGroupById(id) {
    const response = await api.get(`/admin/groups/${id}`);
    return response.data;
  }

  async getGroupByName(name) {
    const response = await api.get(`/admin/groups/name/${name}`);
    return response.data;
  }

  async createGroup(groupData) {
    const response = await api.post('/admin/groups', groupData);
    return response.data;
  }

  async updateGroup(id, groupData) {
    const response = await api.put(`/admin/groups/${id}`, groupData);
    return response.data;
  }

  async deleteGroup(id) {
    const response = await api.delete(`/admin/groups/${id}`);
    return response.data;
  }

  async getGroupPersons(id) {
    const response = await api.get(`/admin/groups/${id}/persons`);
    return response.data;
  }

  async getGroupMembers(id) {
    const response = await api.get(`/admin/groups/${id}/persons`);
    return response.data;
  }

  async addPersonToGroup(groupId, personId) {
    const response = await api.post(`/admin/groups/${groupId}/persons?personId=${personId}`);
    return response.data;
  }

  async removePersonFromGroup(groupId, personId) {
    const response = await api.delete(`/admin/groups/${groupId}/persons/${personId}`);
    return response.data;
  }
}

export default new GroupService();
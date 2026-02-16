import api from './apiService';

class PersonService {
  async getAllPersons() {
    const response = await api.get('/admin/persons');
    return response.data;
  }

  async getPersonById(id) {
    const response = await api.get(`/admin/persons/${id}`);
    return response.data;
  }

  async createPerson(personData) {
    const response = await api.post('/admin/persons', personData);
    return response.data;
  }

  async updatePerson(id, personData) {
    const response = await api.put(`/admin/persons/${id}`, personData);
    return response.data;
  }

  async deletePerson(id) {
    const response = await api.delete(`/admin/persons/${id}`);
    return response.data;
  }
}

export default new PersonService();
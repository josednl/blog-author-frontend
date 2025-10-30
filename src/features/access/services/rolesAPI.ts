import apiClient from '@/shared/api/apiClient';

export const rolesAPI = {
  async getAll() {
    const response = await apiClient.get('/roles');
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get(`/roles/${id}`);
    return response.data;
  },

  async create(data: { name: string; description?: string }) {
    const response = await apiClient.post('/roles', data);
    return response.data;
  },

  async update(id: string, data: { name?: string; description?: string }) {
    const response = await apiClient.put(`/roles/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/roles/${id}`);
    return response.data;
  },
};

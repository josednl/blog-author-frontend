import apiClient from '@/shared/api/apiClient';

export const permissionsAPI = {
  async getAll() {
    const response = await apiClient.get('/permissions');
    return response.data;
  },

  async getById(id: string | number) {
    const response = await apiClient.get(`/permissions/${id}`);
    return response.data;
  },

  async create(data: { name: string; description?: string }) {
    const response = await apiClient.post('/permissions', data);
    return response.data;
  },

  async update(id: string | number, data: { name?: string; description?: string }) {
    const response = await apiClient.put(`/permissions/${id}`, data);
    return response.data;
  },

  async delete(id: string | number) {
    const response = await apiClient.delete(`/permissions/${id}`);
    return response.data;
  },
};

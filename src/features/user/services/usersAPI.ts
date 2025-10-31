import apiClient from '@/shared/api/apiClient';
import { User } from '../types/userTypes';

export const usersAPI = {
  async getAll() {
    const response = await apiClient.get('/users');
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  async create(data: User) {
    try {
    const response = await apiClient.post('/users', data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
  },

  async update(id: string, data: Partial<User>) {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },
};

import apiClient from '@/shared/api/apiClient';
import { Post } from '../types/postTypes';

export const postsAPI = {
  async create(data: Omit<Post, 'id'>) {
    try {
      const response = await apiClient.post('/posts', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating post', error);
      throw error;
    }
  },

  async update(id: string, data: Partial<Post>) {
    const response = await apiClient.put(`/posts/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/posts/${id}`);
    return response.data;
  },
};

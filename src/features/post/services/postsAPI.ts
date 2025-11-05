import apiClient from '@/shared/api/apiClient';
import { Post } from '../types/postTypes';

export const postsAPI = {

  async getAllByUser(userId: string) {
    const response = await apiClient.get(`/posts/user/${userId}`);
    return response.data;
  },

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

  async uploadImage(formData: FormData) {
    formData.append('type', 'POST');

    const response = await apiClient.post('/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async deleteImage(imageId: string) {
    const response = await apiClient.delete(`/images/${imageId}`);
    return response.data;
  },
};

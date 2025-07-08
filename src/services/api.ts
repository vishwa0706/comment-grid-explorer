import { User, Comment } from '@/types/api';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const apiService = {
  async getUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${BASE_URL}/users`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async getComments(): Promise<Comment[]> {
    try {
      const response = await fetch(`${BASE_URL}/comments`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }
};
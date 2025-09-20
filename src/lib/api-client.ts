// src/lib/api-client.ts
import { auth } from './firebase'; // Assuming you have a firebase initialization file

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = {
  get: async (path: string) => {
    const token = await auth.currentUser?.getIdToken();

    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    return response.json();
  },
  // We can add post, put, delete methods here later
};

export default apiClient;

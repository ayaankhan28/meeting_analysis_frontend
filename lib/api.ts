import { User } from "@/hooks/useAuth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function syncUser(user: User) {
  try {
    // Transform user data to match expected backend format
    const userData = {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email?.split('@')[0] || '',
      avatar_url: user.user_metadata?.avatar_url || null
    };

    const response = await fetch(`${API_BASE_URL}/sync_user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Failed to sync user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error syncing user:', error);
    throw error;
  }
} 
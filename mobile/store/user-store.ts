import { create } from 'zustand';
import { User } from '../../shared/types';
import api from '../../shared/api';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.login(email, password);
      if (response.success && response.data) {
        set({ user: response.data.user, isAuthenticated: true, isLoading: false });
      } else {
        set({ error: response.error || 'Login failed', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Network error', isLoading: false });
    }
  },

  register: async (email: string, password: string, name: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.register(email, password, name);
      if (response.success && response.data) {
        set({ user: response.data.user, isAuthenticated: true, isLoading: false });
      } else {
        set({ error: response.error || 'Registration failed', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Network error', isLoading: false });
    }
  },

  logout: async () => {
    await api.logout();
    set({ user: null, isAuthenticated: false });
  },

  loadUser: async () => {
    set({ isLoading: true });
    try {
      await api.loadToken();
      const response = await api.getMe();
      if (response.success && response.data) {
        set({ user: response.data, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

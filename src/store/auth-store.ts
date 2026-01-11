import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'TUTOR' | 'SUPER_ADMIN' | 'APPLICANT';
  avatar?: string;
  isVerified?: boolean;
  phone?: string;
  address?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (token: string) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
}

// Helper to set cookie (accessible by middleware)
const setAuthCookie = (token: string) => {
  if (typeof document !== 'undefined') {
    // Set cookie with 7 days expiry (same as typical refresh token)
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    document.cookie = `accessToken=${token};path=/;expires=${expires.toUTCString()};SameSite=Lax`;
  }
};

// Helper to clear auth cookie
const clearAuthCookie = () => {
  if (typeof document !== 'undefined') {
    document.cookie = 'accessToken=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken) => {
        setAuthCookie(accessToken); // Set cookie for middleware
        set({ user, accessToken, isAuthenticated: true });
      },

      setAccessToken: (accessToken) => {
        set({ accessToken });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },

      logout: () => {
        clearAuthCookie(); // Clear cookie on logout
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
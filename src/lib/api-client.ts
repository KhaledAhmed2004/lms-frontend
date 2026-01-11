import axios from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

// ============ Custom API Error ============
export interface IErrorMessage {
  path: string;
  message: string;
}

export class ApiError extends Error {
  status: number;
  errorMessages: IErrorMessage[];

  constructor(message: string, status: number, errorMessages: IErrorMessage[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errorMessages = errorMessages;
  }

  // Get all error messages as single string
  getFullMessage(): string {
    if (this.errorMessages.length > 0) {
      return this.errorMessages.map((e) => e.message).join(', ');
    }
    return this.message;
  }
}

// Extract error from backend response
const extractApiError = (error: any): ApiError => {
  const response = error?.response?.data;
  const status = error?.response?.status || 500;

  // Backend sends: { success: false, message: "...", errorMessages: [...] }
  const message = response?.message || error?.message || 'Something went wrong';
  const errorMessages: IErrorMessage[] = response?.errorMessages || [];

  // Debug log for development
  if (process.env.NODE_ENV === 'development') {
    console.error('🚨 API Error:', {
      status,
      message,
      errorMessages,
      url: error?.config?.url,
      fullResponse: response,
    });
  }

  return new ApiError(message, status, errorMessages);
};

// Public endpoints - token লাগবে না
const isPublicEndpoint = (url: string, method: string): boolean => {
  if (url.startsWith('/auth/')) return true;
  if (url === '/users' && method === 'POST') return true;
  if (url.startsWith('/subjects') && method === 'GET') return true;
  if (url.startsWith('/grades') && method === 'GET') return true;
  if (url.startsWith('/school-types') && method === 'GET') return true;
  if (url === '/trial-requests' && method === 'POST') return true;
  if (url === '/applications' && method === 'POST') return true;
  return false;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - conditionally add token
apiClient.interceptors.request.use((config) => {
  const url = config.url || '';
  const method = (config.method || 'GET').toUpperCase();

  if (!isPublicEndpoint(url, method)) {
    // Dynamic import to avoid circular dependency
    const { useAuthStore } = require('@/store/auth-store');
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor - auto refresh token on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 - Token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = data.data.accessToken;

        const { useAuthStore } = require('@/store/auth-store');
        useAuthStore.getState().setAccessToken(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        const { useAuthStore } = require('@/store/auth-store');
        useAuthStore.getState().logout();

        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw extractApiError(refreshError);
      }
    }

    // Throw custom ApiError with proper message
    throw extractApiError(error);
  }
);
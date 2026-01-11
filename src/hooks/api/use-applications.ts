import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore, type User } from '@/store/auth-store';

// ============ Types ============
export interface SubmitApplicationData {
  // Auth
  email: string;
  password: string;
  // Personal
  name: string;
  birthDate: string;
  phoneNumber: string;
  // Address
  street: string;
  houseNumber: string;
  zip: string;
  city: string;
  // Subjects
  subjects: string[];
  // Documents (Files)
  cv: File;
  abiturCertificate: File;
  officialId: File;
}

export interface ApplicationResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    application: {
      _id: string;
      name: string;
      email: string;
      status: string;
    };
    user: User;
    accessToken: string;
  };
}

// Application status type
export type ApplicationStatus =
  | 'SUBMITTED'
  | 'REVISION'
  | 'RESUBMITTED'
  | 'SELECTED_FOR_INTERVIEW'
  | 'APPROVED'
  | 'REJECTED';

// Full application data (for my-application endpoint)
export interface TutorApplication {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  street: string;
  houseNumber: string;
  zip: string;
  city: string;
  cv: string;
  abiturCertificate: string;
  officialId: string;
  subjects: Array<{ name: string }>;
  status: ApplicationStatus;
  rejectionReason?: string;
  revisionNote?: string;
  interviewCancelledReason?: string;
  interviewCancelledAt?: string;
  submittedAt: string;
  selectedForInterviewAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============ API Functions ============
const submitApplication = async (
  data: SubmitApplicationData
): Promise<ApplicationResponse> => {
  const formData = new FormData();

  // Append files
  formData.append('cv', data.cv);
  formData.append('abiturCertificate', data.abiturCertificate);
  formData.append('officialId', data.officialId);

  // Append JSON data
  const jsonData = {
    email: data.email,
    password: data.password,
    name: data.name,
    birthDate: data.birthDate,
    phoneNumber: data.phoneNumber,
    street: data.street,
    houseNumber: data.houseNumber,
    zip: data.zip,
    city: data.city,
    subjects: data.subjects,
  };
  formData.append('data', JSON.stringify(jsonData));

  const response = await apiClient.post('/applications', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// ============ Hooks ============

/**
 * Submit tutor application (Public - no auth required)
 * Creates user + application in one step
 * Auto-login after successful submission
 */
export const useSubmitApplication = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: submitApplication,
    onSuccess: (response) => {
      // Auto-login if accessToken returned
      if (response.data?.accessToken && response.data?.user) {
        setAuth(response.data.user, response.data.accessToken);
      }
    },
  });
};

/**
 * Get my application (Protected - APPLICANT role required)
 * Fetches the current user's tutor application
 * Auto-updates auth token if user was approved as TUTOR
 */
export const useMyApplication = (options?: { enabled?: boolean }) => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const currentUser = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['myApplication'],
    queryFn: async () => {
      const response = await apiClient.get('/applications/my-application');
      const { data, accessToken } = response.data;

      // If new token is provided (user was approved), update auth store
      if (accessToken && currentUser) {
        setAuth({ ...currentUser, role: 'TUTOR' }, accessToken);
      }

      return data as TutorApplication;
    },
    staleTime: 2 * 60 * 1000, // 2 min cache
    retry: false, // Don't retry on 404
    enabled: options?.enabled ?? true,
  });
};

export interface UpdateMyApplicationData {
  cv?: File;
  abiturCertificate?: File;
  officialId?: File;
}

/**
 * Update my application (Protected - APPLICANT role required)
 * Can only be used when application is in REVISION status
 * After update, application status changes to SUBMITTED
 */
export const useUpdateMyApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateMyApplicationData) => {
      const formData = new FormData();

      if (data.cv) {
        formData.append('cv', data.cv);
      }
      if (data.abiturCertificate) {
        formData.append('abiturCertificate', data.abiturCertificate);
      }
      if (data.officialId) {
        formData.append('officialId', data.officialId);
      }

      const response = await apiClient.patch(
        '/applications/my-application',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myApplication'] });
    },
  });
};
// API configuration and utilities
const API_BASE_URL = 'http://localhost:3000'; // Rails backend URL

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  errors?: string[];
  status: number;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return {
          error: data?.error || data?.errors?.join(', ') || `HTTP ${response.status}`,
          errors: data?.errors || [data?.error || `HTTP ${response.status}`],
          status: response.status,
        };
      }

      return {
        data,
        status: response.status,
      };
    } catch (error: any) {
      return {
        error: error.message || 'Network error',
        status: 0,
      };
    }
  }

  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Auth services
export const authApi = {
  login: async (email: string, password: string) => {
    return apiClient.post('/users/sign_in', {
      user: { email, password },
    });
  },

  register: (userData: any) => {
    return apiClient.post('/users', {
      user: userData,
    });
  },

  logout: () => {
    return apiClient.delete('/users/sign_out');
  },

  getCurrentUser: () => {
    return apiClient.get('/users/current');
  },
};

// Course services
export const coursesApi = {
  getCourses: (year?: number, semester?: string) => {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (semester) params.append('semester', semester);
    
    const endpoint = `/courses${params.toString() ? `?${params.toString()}` : ''}`;
    return apiClient.get(endpoint);
  },

  getCourse: (courseCode: string) => {
    return apiClient.get(`/courses/${courseCode}`);
  },

  getAssistantsForCourse: (courseCode: string) => {
    return apiClient.get(`/courses/${courseCode}/assistants`);
  },
};

// Assistant services
export const assistantApi = {
  getAssignedCourses: (assistantId: number) => {
    return apiClient.get(`/assistant_courses/by_assistant/${assistantId}`);
  },

  updateCourses: (data: {
    assistant_id: number;
    course_ids: string[];
    special_course_codes: string[];
    availability_updates: any[];
  }) => {
    return apiClient.post('/assistant_courses/bulk_update_with_availability', data);
  },
};

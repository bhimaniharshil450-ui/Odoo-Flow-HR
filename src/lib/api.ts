const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function to get auth token
const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

// Helper function to make authenticated requests
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = getAuthToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || 'Request failed');
    }

    return response.json();
};

// Auth API
export const authAPI = {
    login: async (email: string, password: string) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
        }

        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    },

    register: async (email: string, password: string, name: string, role: string) => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name, role }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Registration failed');
        }

        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    },

    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },
};

// Attendance API
export const attendanceAPI = {
    getRecords: (employeeId?: number) => {
        const query = employeeId ? `?employeeId=${employeeId}` : '';
        return fetchWithAuth(`/attendance${query}`);
    },

    checkIn: (employeeId: number) => {
        return fetchWithAuth('/attendance/checkin', {
            method: 'POST',
            body: JSON.stringify({ employeeId }),
        });
    },

    checkOut: (employeeId: number) => {
        return fetchWithAuth('/attendance/checkout', {
            method: 'POST',
            body: JSON.stringify({ employeeId }),
        });
    },
};

// Leave API
export const leaveAPI = {
    getRequests: (employeeId?: number, status?: string) => {
        const params = new URLSearchParams();
        if (employeeId) params.append('employeeId', employeeId.toString());
        if (status) params.append('status', status);
        const query = params.toString() ? `?${params.toString()}` : '';
        return fetchWithAuth(`/leaves${query}`);
    },

    createRequest: (data: {
        employeeId: number;
        employeeName: string;
        type: string;
        startDate: string;
        endDate: string;
        reason: string;
    }) => {
        return fetchWithAuth('/leaves', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateStatus: (id: number, status: string) => {
        return fetchWithAuth(`/leaves/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
    },

    deleteRequest: (id: number) => {
        return fetchWithAuth(`/leaves/${id}`, {
            method: 'DELETE',
        });
    },
};

// Employee API
export const employeeAPI = {
    getAll: () => {
        return fetchWithAuth('/employees');
    },

    getById: (id: number) => {
        return fetchWithAuth(`/employees/${id}`);
    },

    update: (id: number, data: any) => {
        return fetchWithAuth(`/employees/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },
};

// Health check
export const healthCheck = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        return response.ok;
    } catch {
        return false;
    }
};

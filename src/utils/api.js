const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const AUTH_REDIRECT_MESSAGE_KEY = 'authRedirectMessage';


class ApiClient {
    constructor() {
        this.baseURL = API_BASE_URL;
        // Promise that represents an in-flight refresh request
        this.refreshPromise = null;
    }

    /**
     * Get auth token from localStorage
     */
    getToken() {
        return localStorage.getItem('accessToken');
    }

    /**
     * Get refresh token from localStorage
     */
    getRefreshToken() {
        return localStorage.getItem('refreshToken');
    }

    /**
     * Set auth tokens in localStorage
     */
    setTokens(accessToken, refreshToken) {
        if (accessToken) localStorage.setItem('accessToken', accessToken);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    }

    /**
     * Clear auth tokens from localStorage
     */
    clearTokens() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    }

    /**
     * Make HTTP request
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const token = this.getToken();

        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        };

        // Add auth token if available
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                // Handle token expiration
                if (response.status === 401 && !endpoint.includes('/auth/refresh')) {
                    // If we've already retried this request, don't try again
                    if (options._retry) {
                        sessionStorage.setItem(
                            AUTH_REDIRECT_MESSAGE_KEY,
                            'Your session expired. Please login again.'
                        );
                        this.clearTokens();
                        window.location.href = '/login';
                        throw new Error(data.message || 'Unauthorized');
                    }

                    const refreshed = await this.refreshAccessToken();
                    if (refreshed) {
                        // Retry original request with new token, but mark as retried
                        return this.request(endpoint, { ...options, _retry: true });
                    } else {
                        sessionStorage.setItem(
                            AUTH_REDIRECT_MESSAGE_KEY,
                            'Your session expired. Please login again.'
                        );
                        this.clearTokens();
                        window.location.href = '/login';
                        throw new Error(data.message || 'Unauthorized');
                    }
                }

                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    /**
     * Refresh access token
     */
    async refreshAccessToken() {
        try {
            // If a refresh is already in progress, await it instead of starting a new one
            if (this.refreshPromise) return await this.refreshPromise;

            this.refreshPromise = (async () => {
                const refreshToken = this.getRefreshToken();
                if (!refreshToken) return false;

                const response = await fetch(`${this.baseURL}/auth/refresh`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken }),
                });

                if (!response.ok) return false;

                const data = await response.json();
                if (data.success && data.data.accessToken) {
                    // Update access token; backend may also return a rotated refresh token
                    this.setTokens(data.data.accessToken, data.data.refreshToken || null);
                    return true;
                }

                return false;
            })();

            const result = await this.refreshPromise;
            this.refreshPromise = null;
            return result;
        } catch (error) {
            this.refreshPromise = null;
            console.error('Token refresh failed:', error);
            return false;
        }
    }

    /**
     * HTTP methods
     */
    get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }

    post(endpoint, body, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    patch(endpoint, body, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(body),
        });
    }

    delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }
}

// Create singleton instance
const api = new ApiClient();

// Authentication API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
    getMe: () => api.get('/auth/me'),
    refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
};

// User API
export const userAPI = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.patch('/users/profile', data),
};

// Founder API
export const founderAPI = {
    verifyCode: (code) => api.post('/founders/verify-code', { code }),
    getDashboard: () => api.get('/founders/dashboard'),
    getReferrals: (page = 1, limit = 10) => api.get(`/founders/referrals?page=${page}&limit=${limit}`),
    getStats: () => api.get('/founders/stats'),
    claimCoin: () => api.post('/founders/claim-coin', {}),
    withdrawCoin: () => api.post('/founders/withdraw-coin', {}),
};

export default api;

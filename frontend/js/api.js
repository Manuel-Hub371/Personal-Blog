const API_BASE_URL = 'https://personal-blog-cqk4.onrender.com/api';
const STATIC_BASE_URL = 'https://personal-blog-cqk4.onrender.com';

const api = {
    // Helper to get headers with token if available
    getHeaders: () => {
        const token = localStorage.getItem('adminToken');
        const headers = {
            'Content-Type': 'application/json'
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    },

    // Helper to handle response and throw error if not OK
    handleResponse: async (res) => {
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || 'API request failed');
        }
        return data;
    },

    // Auth
    login: async (credentials) => {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('adminToken', data.token);
        } else {
            throw new Error(data.message || 'Login failed');
        }
        return data;
    },

    logout: () => {
        localStorage.removeItem('adminToken');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('adminToken');
    },

    updatePassword: async (data) => {
        const res = await fetch(`${API_BASE_URL}/auth/password`, {
            method: 'PUT',
            headers: api.getHeaders(),
            body: JSON.stringify(data)
        });
        return api.handleResponse(res);
    },

    // Posts
    getPosts: async () => {
        const res = await fetch(`${API_BASE_URL}/posts`, { cache: 'no-store' });
        return api.handleResponse(res);
    },

    getPost: async (id) => {
        const res = await fetch(`${API_BASE_URL}/posts/${id}`, { cache: 'no-store' });
        return api.handleResponse(res);
    },

    createPost: async (postData) => {
        const res = await fetch(`${API_BASE_URL}/posts`, {
            method: 'POST',
            headers: api.getHeaders(),
            body: JSON.stringify(postData)
        });
        return api.handleResponse(res);
    },

    updatePost: async (id, postData) => {
        const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
            method: 'PUT',
            headers: api.getHeaders(),
            body: JSON.stringify(postData)
        });
        return api.handleResponse(res);
    },

    deletePost: async (id) => {
        const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
            method: 'DELETE',
            headers: api.getHeaders()
        });
        return api.handleResponse(res);
    },

    // Project Methods
    getProjects: async () => {
        const res = await fetch(`${API_BASE_URL}/projects`, { cache: 'no-store' });
        return api.handleResponse(res);
    },

    getProject: async (id) => {
        const res = await fetch(`${API_BASE_URL}/projects/${id}`, { cache: 'no-store' });
        return api.handleResponse(res);
    },

    createProject: async (projectData) => {
        const res = await fetch(`${API_BASE_URL}/projects`, {
            method: 'POST',
            headers: api.getHeaders(),
            body: JSON.stringify(projectData)
        });
        return api.handleResponse(res);
    },

    updateProject: async (id, projectData) => {
        const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
            method: 'PUT',
            headers: api.getHeaders(),
            body: JSON.stringify(projectData)
        });
        return api.handleResponse(res);
    },

    deleteProject: async (id) => {
        const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
            method: 'DELETE',
            headers: api.getHeaders()
        });
        return api.handleResponse(res);
    },

    // User
    getUser: async () => {
        const res = await fetch(`${API_BASE_URL}/user`);
        return await res.json();
    },

    updateUser: async (userData) => {
        const res = await fetch(`${API_BASE_URL}/user`, {
            method: 'PUT',
            headers: api.getHeaders(),
            body: JSON.stringify(userData)
        });
        return api.handleResponse(res);
    },

    // Contact Messages
    getMessages: async (status = '') => {
        const token = localStorage.getItem('adminToken');
        const url = status ? `${API_BASE_URL}/contact?status=${status}` : `${API_BASE_URL}/contact`;
        const res = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await res.json();
    },

    updateMessageStatus: async (id, status) => {
        const res = await fetch(`${API_BASE_URL}/contact/${id}/status`, {
            method: 'PUT',
            headers: api.getHeaders(),
            body: JSON.stringify({ status })
        });
        return api.handleResponse(res);
    },

    deleteMessage: async (id) => {
        return api.updateMessageStatus(id, 'deleted');
    },

    hardDeleteMessage: async (id) => {
        const res = await fetch(`${API_BASE_URL}/contact/${id}`, {
            method: 'DELETE',
            headers: api.getHeaders()
        });
        return api.handleResponse(res);
    },

    // File Upload
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const token = localStorage.getItem('adminToken');
        const res = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }, // No Content-Type for FormData
            body: formData
        });
        return api.handleResponse(res);
    },

    sendMessage: async (messageData) => {
        const res = await fetch(`${API_BASE_URL}/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(messageData)
        });
        return api.handleResponse(res);
    },

    // About Content
    getAbout: async () => {
        const res = await fetch(`${API_BASE_URL}/about`);
        return await res.json();
    },

    updateAbout: async (data) => {
        const res = await fetch(`${API_BASE_URL}/about`, {
            method: 'PUT',
            headers: api.getHeaders(),
            body: JSON.stringify(data)
        });
        return api.handleResponse(res);
    },

    // Utilities
    getToken: () => localStorage.getItem('adminToken')
};

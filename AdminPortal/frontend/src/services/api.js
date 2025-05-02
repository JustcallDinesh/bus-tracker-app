// bus-tracker-admin-frontend/src/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001/api', // Your API base URL
});

let refreshingToken = false;
let tokenQueue = [];

const getNewToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            window.location.href = '/login';
            return null;
        }

        const response = await api.post('/auth/refresh', { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        return accessToken;
    } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('username');
        window.location.href = '/login';
        return null;
    } finally {
        refreshingToken = false;
        processQueue(null, localStorage.getItem('authToken'));
    }
};

const processQueue = (error, token = null) => {
    tokenQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    tokenQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (refreshingToken) {
                return new Promise((resolve, reject) => {
                    tokenQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            refreshingToken = true;
            const newToken = await getNewToken();
            if (newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
import axios from "axios";
import React from 'react';

const authAxios = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/users/auth/`,
    withCredentials: true
})

authAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.data.message == 'jwt expired' || error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Just hit refresh route
                await authAxios.post("import.meta.env.VITE_BACKEND_URL}/users/auth/resetRefreshToken");

                // Retry original request
                return authAxios(originalRequest);
            } catch (err) {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);



export default authAxios;
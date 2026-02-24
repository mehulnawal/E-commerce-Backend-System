import axios from "axios";

const authAxios = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1`,
    withCredentials: true
});

authAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                // Call refresh route
                await authAxios.post("/users/auth/resetRefreshToken");

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
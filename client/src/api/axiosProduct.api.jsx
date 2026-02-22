import axios from "axios";

export const productAxios = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/admin/products/`,
    withCredentials: true
})

productAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.data.message == 'jwt expired' || error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Just hit refresh route
                await productAxios.post("import.meta.env.VITE_BACKEND_URL}/users/auth/resetRefreshToken");

                // Retry original request
                return productAxios(originalRequest);
            } catch (err) {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

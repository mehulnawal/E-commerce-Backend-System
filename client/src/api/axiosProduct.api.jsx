import axios from "axios";

export const productAxios = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/products`,
    withCredentials: true
});

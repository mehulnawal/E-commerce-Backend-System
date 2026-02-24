import axios from "axios";

export const productAxios = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/admin/products`,
    withCredentials: true
});

import axios from "axios";

const productAxios = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/products`,
    withCredentials: true
});

export default productAxios;
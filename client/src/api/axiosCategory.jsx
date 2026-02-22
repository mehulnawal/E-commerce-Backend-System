import axios from "axios";

const axiosCategory = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/admin/category/`,
    withCredentials: true
})

export default axiosCategory;
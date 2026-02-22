import axios from "axios";

const axiosSubCategory = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/admin/subCategory/`,
    withCredentials: true
})

export default axiosSubCategory;
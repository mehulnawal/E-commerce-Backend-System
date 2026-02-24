import axios from "axios";

const authAxios = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/auth`,
    withCredentials: true
});

export default authAxios;
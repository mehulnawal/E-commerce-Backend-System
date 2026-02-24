import axios from "axios";

const authAxios = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/users/auth`,
    withCredentials: true
});

export default authAxios;
import axios from "axios";

const cartAxios = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/cart/`,
    withCredentials: true
})

export default cartAxios;
import axios from "axios";

export const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const REQUEST_TIMEOUT = 50000;

const instance = axios.create({
    baseURL: BASE_URL,
    timeout: REQUEST_TIMEOUT,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
    },
});
export default instance;
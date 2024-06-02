import axios from "axios";

const apiURL = process.env.NEXT_PUBLIC_API_URL || "";
const axiosInstance = axios.create({ baseURL: apiURL });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export { axiosInstance as axios };

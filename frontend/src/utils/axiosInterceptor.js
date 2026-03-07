import axios from "axios";
import { toast } from "react-toastify";

export const handleResponseError = (error) => {
  if (error.response && error.response.status === 429) {
    toast.error(
      "Too many requests. Please wait a moment before trying again.",
      {
        toastId: "rate-limit-error",
        autoClose: 5000,
      }
    );
  }
  return Promise.reject(error);
};

const setupAxiosInterceptors = () => {
  const interceptorId = axios.interceptors.response.use(
    (response) => response,
    handleResponseError
  );
  return () => axios.interceptors.response.eject(interceptorId);
};

export default setupAxiosInterceptors;

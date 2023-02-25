import axios from "axios";
import Config from "react-native-config";
import {store} from "../../../store/store";
import {translate} from "../index";
import {refreshToken} from "./RefreshToken";


const axiosInstance = axios.create({
  baseURL: Config.SERVICE_URL,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const auth = store.getState().getTokenReducer.auth;
    if (auth?.access_token) {
      config.headers.Authorization = `Bearer ${auth.access_token || auth.token}`;
    }

    return config;
  },
  async (error) => {
    await Promise.reject(error);
  }
);

let counter = 0;
axiosInstance.interceptors.response.use(
  ({data}) => data,
  async function (error) {
    const originalRequest = error.config;

    if (error?.response?.status === 502) {
      counter++;
      originalRequest._retry = true;
      return axiosInstance(originalRequest);
    }

    if (error?.response?.status === 401 && !originalRequest._retry && counter < 3) {
      counter++;
      originalRequest._retry = true;
      try {
        const user = await refreshToken();
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${user.access_token || user.token}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        throw new Error(err.response?.data.message || err || translate("server_error", "errors"));
      }
    } else {
      throw new Error(error.response?.data.message || error || translate("server_error", "errors"));
    }
  }
);

export default {
  get: axiosInstance.get,
  post: axiosInstance.post,
}

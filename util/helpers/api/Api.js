import axios from "axios";
import Config from "react-native-config";
import {store} from "../../../store/store";
import {translate} from "../index";
import {refreshToken} from "./RefreshToken";

const axiosInstance = axios.create({
  baseURL: Config.SERVICE_URL,
  timeout: 10000,
  retry: 5,
  retryDelay: 1000,
  timeoutErrorMessage: translate("timeout", "errors"),
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

axiosInstance.interceptors.response.use(
  ({data}) => data,
  async function (error) {
    const {config} = error;

    error.code === 'ERR_NETWORK' && (error.message = translate("server_error", "errors"));
    error.message === "CanceledError: canceled" && (error.message = translate("you_cancelled_upload", "upload"));
    error.message === "AxiosError: timeout of 10000ms exceeded" || error?.code === 'ECONNABORTED' && (error.message = translate("timeout", "errors"));


    if (!config || !config.retry) {
      throw new Error(error.response?.data.message || error || translate("server_error", "errors"));
    }

    if (error?.response?.status === 502) {
      config.retry -= 1;
      await new Promise((resolve) => setTimeout(resolve, config.retryDelay));
      return axiosInstance(config);
    }

    if (error?.response?.status === 401) {
      config.retry -= 1;
      try {
        const user = await refreshToken();
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${user.access_token || user.token}`;
        return axiosInstance(config);
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

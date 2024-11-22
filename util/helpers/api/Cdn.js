import axios from "axios";

import {store} from "../../../store/store";
import {translate} from "../index";
import {refreshToken} from "./RefreshToken";

const cdnInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_CDN_URL,
  timeout: 10000,
  retry: 5,
  retryDelay: 1000,
  timeoutErrorMessage: translate("timeout", "errors"),
});

cdnInstance.interceptors.request.use(
  async (config) => {
    config.withCredentials = false;
    config.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
    config.headers.Expires = 0;
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

cdnInstance.interceptors.response.use(
  ({data}) => data,
  async function (error) {
    const {config} = error;

    error.code === 'ERR_NETWORK' && (error.message = translate("server_error", "errors"));
    error.message === "CanceledError: canceled" && (error.message = translate("you_cancelled_upload", "upload"));
    error.message === "AxiosError: timeout of 10000ms exceeded" || error?.code === 'ECONNABORTED' && (error.message = translate("timeout", "errors"));

    if (!config || !config.retry) {
      throw new Error(error.response?.data.message || error || translate("server_error", "errors"));
    }

    if (error?.response?.status === 502 || error?.code === 'ECONNABORTED') {
      config.retry -= 1;
      await new Promise((resolve) => setTimeout(resolve, config.retryDelay));
      return cdnInstance(config);
    }

    if (error?.response?.status === 401) {
      config.retry -= 1;
      try {
        const user = await refreshToken();
        cdnInstance.defaults.headers.common["Authorization"] = `Bearer ${user.access_token || user.token}`;
        return cdnInstance(config);
      } catch (err) {
        throw new Error(err);
      }
    } else {
      return Promise.reject(error);
    }
  }
);

export default {
  get: cdnInstance.get,
  post: cdnInstance.post,
}

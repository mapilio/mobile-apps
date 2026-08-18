import axios from 'axios';
import { translate } from '../index';

const publicAxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_SERVICE_URL,
  timeout: 10000,
  timeoutErrorMessage: translate('timeout', 'errors'),
});

publicAxiosInstance.interceptors.response.use(
  ({ data }) => data,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      error.message = translate('server_error', 'errors');
    }

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      error.message = translate('timeout', 'errors');
    }

    const message =
      error.response?.data?.message || error.message || translate('server_error', 'errors');
    throw new Error(message);
  }
);

export default {
  get: publicAxiosInstance.get,
  post: publicAxiosInstance.post,
};

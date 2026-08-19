import axios from 'axios';
import { translate } from '../index';

export const getPublicApiErrorMessage = (error) => {
  const responseData = error.response?.data;
  const validationMessage =
    responseData && typeof responseData === 'object'
      ? Object.values(responseData)
          .flat()
          .find((value) => typeof value === 'string')
      : null;

  return (
    responseData?.message ||
    validationMessage ||
    error.message ||
    translate('server_error', 'errors')
  );
};

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

    throw new Error(getPublicApiErrorMessage(error));
  }
);

export default {
  get: publicAxiosInstance.get,
  post: publicAxiosInstance.post,
};

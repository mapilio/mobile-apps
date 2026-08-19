import api from './Api';
import publicApi from './PublicApi';
import { mobileAccountPaths } from './MobileAccountPaths';

const multipartConfig = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};

export const mobileAccountApi = Object.freeze({
  register: (payload) => publicApi.post(mobileAccountPaths.register, payload, multipartConfig),
  forgotPassword: (payload) =>
    publicApi.post(mobileAccountPaths.forgotPassword, payload, multipartConfig),
  updateProfile: (payload) => api.post(mobileAccountPaths.profile, payload, multipartConfig),
  updateEmail: (payload) => api.post(mobileAccountPaths.email, payload, multipartConfig),
  deleteAccount: (payload) => api.delete(mobileAccountPaths.account, { data: payload }),
});

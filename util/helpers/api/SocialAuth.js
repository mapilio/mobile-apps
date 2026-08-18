import publicApi from './PublicApi';

const SOCIAL_TOKEN_PATH = '/api/v1/mobile/auth/social-token';

export const socialTokenLogin = (provider, token) =>
  publicApi.post(SOCIAL_TOKEN_PATH, { provider, token });

export default socialTokenLogin;

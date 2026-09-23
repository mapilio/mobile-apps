import { Platform } from 'react-native';
import { AuthRequest, exchangeCodeAsync, makeRedirectUri } from 'expo-auth-session';
import { discovery } from 'expo-auth-session/providers/google';
import { authorizeGoogleDeletion } from '../../components/SocialLogin/googleDeletionAuthorization';

const mockPrompt = jest.fn();
jest.mock('expo-application', () => ({ applicationId: 'com.mapilio.test' }));
jest.mock('expo-auth-session', () => ({
  AuthRequest: jest.fn().mockImplementation(() => ({
    codeVerifier: 'generated-pkce-verifier',
    promptAsync: (...args) => mockPrompt(...args),
  })),
  exchangeCodeAsync: jest.fn(),
  makeRedirectUri: jest.fn(({ native }) => native),
}));
jest.mock('expo-auth-session/providers/google', () => ({
  discovery: {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
  },
}));

describe('Google authorization for account deletion', () => {
  const originalIos = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  const originalAndroid = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID = 'synthetic-ios-client';
    process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID = 'synthetic-android-client';
    mockPrompt.mockResolvedValue({ type: 'success', params: { code: 'one-time-code' } });
    exchangeCodeAsync.mockResolvedValue({ accessToken: 'fresh-token' });
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  afterAll(() => {
    if (originalIos === undefined) delete process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
    else process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID = originalIos;
    if (originalAndroid === undefined) delete process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
    else process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID = originalAndroid;
  });

  it.each(['ios', 'android'])(
    'uses the existing %s client, redirect and PKCE exchange',
    async (platform) => {
      jest.spyOn(Platform, 'select').mockImplementation((choices) => choices[platform]);
      await expect(authorizeGoogleDeletion()).resolves.toBe('fresh-token');
      expect(AuthRequest).toHaveBeenCalledWith({
        clientId: `synthetic-${platform}-client`,
        redirectUri: 'com.mapilio.test:/oauthredirect',
        scopes: ['openid', 'profile', 'email'],
        responseType: 'code',
        usePKCE: true,
        codeChallengeMethod: 'S256',
        prompt: 'select_account',
      });
      expect(makeRedirectUri).toHaveBeenCalledWith({ native: 'com.mapilio.test:/oauthredirect' });
      expect(mockPrompt).toHaveBeenCalledWith(discovery);
      expect(exchangeCodeAsync).toHaveBeenCalledWith(
        {
          clientId: `synthetic-${platform}-client`,
          redirectUri: 'com.mapilio.test:/oauthredirect',
          code: 'one-time-code',
          extraParams: { code_verifier: 'generated-pkce-verifier' },
        },
        discovery
      );
    }
  );

  it.each(['cancel', 'dismiss'])('stops quietly on %s', async (type) => {
    mockPrompt.mockResolvedValue({ type });
    await expect(authorizeGoogleDeletion()).resolves.toBeNull();
    expect(exchangeCodeAsync).not.toHaveBeenCalled();
  });

  it.each([{ type: 'error' }, { type: 'locked' }, { type: 'success', params: {} }])(
    'rejects an incomplete authorization result %p',
    async (result) => {
      mockPrompt.mockResolvedValue(result);
      await expect(authorizeGoogleDeletion()).rejects.toThrow();
      expect(exchangeCodeAsync).not.toHaveBeenCalled();
    }
  );

  it('fails before opening the browser when Google is not configured', async () => {
    delete process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
    delete process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
    await expect(authorizeGoogleDeletion()).rejects.toThrow('not configured');
    expect(mockPrompt).not.toHaveBeenCalled();
  });

  it('rejects a failed token exchange', async () => {
    exchangeCodeAsync.mockRejectedValue(new Error('exchange failed'));
    await expect(authorizeGoogleDeletion()).rejects.toThrow('exchange failed');
  });

  it('rejects an exchange response without an access token', async () => {
    exchangeCodeAsync.mockResolvedValue({});
    await expect(authorizeGoogleDeletion()).rejects.toThrow('access token');
  });
});

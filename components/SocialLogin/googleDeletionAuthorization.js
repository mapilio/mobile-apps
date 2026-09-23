import { Platform } from 'react-native';
import * as Application from 'expo-application';
import { AuthRequest, exchangeCodeAsync, makeRedirectUri } from 'expo-auth-session';
import { discovery } from 'expo-auth-session/providers/google';

export async function authorizeGoogleDeletion() {
  const clientId = Platform.select({
    ios: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    android: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  });
  if (!clientId || !Application.applicationId) {
    throw new Error('Google authentication is not configured.');
  }

  // Match the existing Google login redirect without changing the signed-in Mapilio user.
  const redirectUri = makeRedirectUri({ native: `${Application.applicationId}:/oauthredirect` });
  const request = new AuthRequest({
    clientId,
    redirectUri,
    scopes: ['openid', 'profile', 'email'],
    responseType: 'code',
    usePKCE: true,
    codeChallengeMethod: 'S256',
    prompt: 'select_account',
  });
  const result = await request.promptAsync(discovery);
  if (result.type === 'cancel' || result.type === 'dismiss') {
    return null;
  }
  if (result.type !== 'success' || !result.params?.code || !request.codeVerifier) {
    throw new Error('Google authentication could not be completed.');
  }

  const authentication = await exchangeCodeAsync(
    {
      clientId,
      redirectUri,
      code: result.params.code,
      extraParams: { code_verifier: request.codeVerifier },
    },
    discovery
  );
  if (!authentication?.accessToken) {
    throw new Error('Google authentication did not return an access token.');
  }
  return authentication.accessToken;
}

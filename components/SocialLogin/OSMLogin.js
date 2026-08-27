import { View, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import { CustomText } from '../../highordercomponents';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, AccessTokenRequest } from 'expo-auth-session';
import { useEffect, useState } from 'react';
import { GET_TOKEN_SUCCESS, SET_CREDENTIAL, SET_MAIL_MODAL_SHOWN } from '../../store/actionsName';
import { socialLoginStyles } from '../../styles/loginStyles';

import { useTranslation } from 'react-i18next';
import { api, socialTokenLogin } from '../../util/helpers/api';
import { useDispatch } from 'react-redux';
import { getUserInformation } from '../../store/reducers/loginReducer/getUserInformation';
import * as Application from 'expo-application';
import { captureException } from '@sentry/react-native';

const discovery = {
  authorizationEndpoint: 'https://www.openstreetmap.org/oauth2/authorize',
  tokenEndpoint: 'https://www.openstreetmap.org/oauth2/token',
};
const redirectUri = makeRedirectUri({
  scheme: Application.applicationId,
  path: 'redirect',
});

WebBrowser.maybeCompleteAuthSession();
const OSMLogin = ({ navigation }) => {
  const { t } = useTranslation('login');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const checkMail = () => {
    api
      .post('/api/function/user_profile/profile/checkIsModalShown')
      .then((res) => {
        if (res.status) {
          toast.show(t('login_success'), { type: 'success' });
          dispatch({ type: SET_MAIL_MODAL_SHOWN, payload: false });
        } else {
          dispatch({ type: SET_MAIL_MODAL_SHOWN, payload: true });
        }
        navigation.goBack();
      })
      .catch((err) => {
        captureException(err, {
          tags: {
            functionName: 'checkMail',
          },
        });
        toast.show(t('error'), { type: 'error' });
        navigation.goBack();
      });
  };

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_OSM_CLIENT_ID,
      scopes: ['read_prefs', 'read_gpx'],
      redirectUri: redirectUri,
      codeChallengeMethod: 'S256',
      usePKCE: true,
    },
    discovery
  );

  const loginToMapilio = (accessToken) => {
    socialTokenLogin('openstreetmap', accessToken)
      .then((res) => {
        dispatch({
          type: SET_CREDENTIAL,
          payload: { type: 'openstreetmap' },
        });
        dispatch({ type: GET_TOKEN_SUCCESS, payload: res });
        dispatch(getUserInformation());
        setLoading(false);
        checkMail();
      })
      .catch(() => {
        setLoading(false);
        toast.show(t('error'), { type: 'error' });
      });
  };

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;

      const getAccessToken = new AccessTokenRequest({
        code: code,
        redirectUri: redirectUri,
        clientId: process.env.EXPO_PUBLIC_OSM_CLIENT_ID,
        scopes: ['read_prefs'],
        extraParams: {
          code_verifier: request.codeVerifier,
        },
      });

      getAccessToken
        .performAsync(discovery)
        .then(({ accessToken }) => {
          setLoading(true);
          loginToMapilio(accessToken);
        })
        .catch(() => {
          toast.show(t('error'), { type: 'error' });
        });
    }
  }, [response]);

  return (
    <TouchableOpacity
      accessibilityLabel="Sign in with OpenStreetMap"
      accessibilityRole="button"
      style={socialLoginStyles.osmButton}
      onPress={() => {
        promptAsync();
      }}>
      <Modal visible={loading} transparent={true} animationType="fade" statusBarTranslucent>
        <View style={socialLoginStyles.modal}>
          <ActivityIndicator size="large" color="white" />
        </View>
      </Modal>
      <CustomText accessibilityRole="text" style={socialLoginStyles.providerText}>
        OSM
      </CustomText>
    </TouchableOpacity>
  );
};

export default OSMLogin;

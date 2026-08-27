import { store } from '../store/store';
import { GET_TOKEN_START, GET_TOKEN_SUCCESS } from '../store/actionsName';
import { getUserInformation } from '../store/reducers/loginReducer/getUserInformation';
import publicApi from '../util/helpers/api/PublicApi';
import { captureException } from '@sentry/react-native';
import { mobileAccountPaths } from '../util/helpers/api/MobileAccountPaths';

export const fetchLogin = async (email, password) => {
  store.dispatch({ type: GET_TOKEN_START });

  try {
    const data = new FormData();
    data.append('email', email);
    data.append('password', password);
    data.append('grant_type', 'password');

    const user = await publicApi.post('/api/v1/mobile/auth/public-token', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    store.dispatch({ type: GET_TOKEN_SUCCESS, payload: user });
    store.dispatch(getUserInformation(user));
    return user;
  } catch (err) {
    throw err || 'There was an error with the server, please try again later.';
  }
};

export const logoutUser = async ({ access_token, refresh_token } = {}) => {
  if (!access_token || !refresh_token) {
    return false;
  }

  try {
    await publicApi.post(
      mobileAccountPaths.logout,
      { refresh_token },
      {
        headers: { Authorization: `Bearer ${access_token}` },
        timeout: 2000,
      }
    );
    return true;
  } catch {
    captureException(new Error('Mobile logout request failed'), {
      tags: { functionName: 'logoutUser' },
    });
    return false;
  }
};

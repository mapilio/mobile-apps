import { GET_USER_INDEX_TYPE, GET_USER_INFORMATION } from '../../actionsName';
import { OneSignal } from 'react-native-onesignal';
import { api } from '../../../util/helpers/api';
import { mobileAccountPaths } from '../../../util/helpers/api/MobileAccountPaths';
import * as Sentry from '@sentry/react-native';

export const getUserInformation = () => async (dispatch, getState) => {
  const { auth, sessionVersion = 0 } = getState().getTokenReducer;
  if (!auth) return null;

  const isCurrentSession = () => {
    const current = getState().getTokenReducer;
    return current.auth && (current.sessionVersion ?? 0) === sessionVersion;
  };

  try {
    const { data } = await api.get(mobileAccountPaths.profile);
    if (!isCurrentSession()) return null;

    const { id, email, display_name, user_profile_photo, username, str_id, user_bio, meters } =
      data[0];

    dispatch({
      type: GET_USER_INDEX_TYPE,
      payload: {
        index: 0,
        type: {
          accountType: 'Individual',
          displayName: display_name,
          picture: user_profile_photo,
          username: username,
          key: str_id,
          id: id,
          bio: user_bio,
          meters: meters,
        },
      },
    });

    dispatch({ type: GET_USER_INFORMATION, payload: data[0] });
    Sentry.setUser({ id: id.toString(), email: email });

    const userData = new FormData();
    userData.append('options[parameters][email]', email);

    await api.post(mobileAccountPaths.onesignalIdentityVerification, userData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (!isCurrentSession()) return null;

    OneSignal.User.addEmail(email);
  } catch (error) {
    if (!isCurrentSession()) return null;
    throw error;
  }
};

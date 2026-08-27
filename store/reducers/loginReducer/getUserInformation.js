import { GET_USER_INDEX_TYPE, GET_USER_INFORMATION } from '../../actionsName';
import { OneSignal } from 'react-native-onesignal';
import { api } from '../../../util/helpers/api';
import { mobileAccountPaths } from '../../../util/helpers/api/MobileAccountPaths';
import * as Sentry from '@sentry/react-native';

export const getUserInformation = () => (dispatch) => {
  return api.get(mobileAccountPaths.profile).then(({ data }) => {
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

    return api
      .post(mobileAccountPaths.onesignalIdentityVerification, userData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        OneSignal.User.addEmail(email);
      });
  });
};

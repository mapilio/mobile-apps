import { store } from '../store/store';
import { GET_TOKEN_START, GET_TOKEN_SUCCESS } from '../store/actionsName';
import { getUserInformation } from '../store/reducers/loginReducer/getUserInformation';
import { api } from '../util/helpers/api';

export const fetchLogin = async (email, password) => {
  store.dispatch({ type: GET_TOKEN_START });

  try {
    const data = new FormData();
    data.append('email', email);
    data.append('password', password);
    data.append('client_id', process.env.EXPO_PUBLIC_AUTH_CLIENT_ID);
    data.append('client_secret', process.env.EXPO_PUBLIC_AUTH_CLIENT_SECRET);
    data.append('grant_type', 'password');
    data.append('device_type', 'mobile');
    data.append('login_type', 'credentials');

    const user = await api.post('/api/v2/login', data, {
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

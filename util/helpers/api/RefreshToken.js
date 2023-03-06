import {store} from "../../../store/store";
import Config from "react-native-config";
import {EXIT_USER, GET_TOKEN_SUCCESS} from "../../../store/actionsName";
import {translate} from "../index";
import api from "./Api";

export const refreshToken = async () => {
  const auth = store.getState().getTokenReducer.auth

  try {
    if (!!auth) {
      const user = await api.post(`${Config.SERVICE_URL}/api/v2/login`, {
        grant_type: 'refresh_token',
        client_id: Config.AUTH_CLIENT_ID,
        client_secret: Config.AUTH_CLIENT_SECRET,
        refresh_token: auth.refresh_token,
      }, {
        retry: 0,
      });

      store.dispatch({type: "GET_TOKEN_SUCCESS", payload: user});

      return user;
    }

    isTokenExpired()
  } catch (error) {
    isTokenExpired(error)
  }
}

const isTokenExpired = () => {
  store.dispatch({type: GET_TOKEN_SUCCESS, payload: null});
  store.dispatch({type: EXIT_USER, payload: null});
  toast.show(translate('token_expired', 'errors'), {type: 'error'});
  throw new Error(translate('token_expired', 'errors'));
}

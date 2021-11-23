import axios from "axios";

import {GET_TOKEN_START, GET_TOKEN_SUCCESS, GET_TOKEN_ERROR} from "../../actionsName";
import {getUserInformation} from "./getUserInformation";
import {ToastAndroid} from "react-native";

export const getTokenAction = (parameters, navigation) => (dispatch) => {
  dispatch({type: GET_TOKEN_START});

  axios
    .post(`https://end.mapilio.com/api/login`, {
      email: parameters.email,
      password: parameters.password,
    })
    .then((response) => {
      dispatch({type: GET_TOKEN_SUCCESS, payload: response.data});
      dispatch(getUserInformation(response.data));
    })
    .catch((error) => {
      ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);
      if (error.response.data.message === "This account is inactive.") {
        dispatch({
          type: GET_TOKEN_ERROR,
          payload: error.response.data.message,
        });
      } else {
        dispatch({type: GET_TOKEN_ERROR, payload: true});
      }
    });
};

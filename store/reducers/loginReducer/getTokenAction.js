import {GET_TOKEN_START, GET_TOKEN_SUCCESS, GET_TOKEN_ERROR} from "../../actionsName";
import {getUserInformation} from "./getUserInformation";
import {ToastAndroid} from "react-native";
import {fetchHandler} from "../../../helper/helper";

export const getTokenAction = (parameters, navigation) => (dispatch) => {
  dispatch({type: GET_TOKEN_START});

  fetchHandler({
    url: `https://end.mapilio.com/api/login`,
    method: "POST",
    data: {
      email: parameters.email,
      password: parameters.password,
    },
  }).then((res) => {
    dispatch({type: GET_TOKEN_SUCCESS, payload: res});
    dispatch(getUserInformation(res));
  }).catch((err) => {
    ToastAndroid.show(err.response.data.message, ToastAndroid.SHORT);
  });
};

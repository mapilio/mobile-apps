import { GET_TOKEN_START, GET_TOKEN_SUCCESS } from "../../actionsName";
import { getUserInformation } from "./getUserInformation";
import { ToastAndroid } from "react-native";
import { fetchHandler, startDB } from "../../../helper/helper";

export const getTokenAction = (parameters, navigation) => (dispatch) => {
  dispatch({ type: GET_TOKEN_START });

  fetchHandler({
    url: `${process.env.API_URL}/api/login`,
    method: "POST",
    data: {
      email: parameters.email,
      password: parameters.password,
    },
  })
    .then((res) => {
      console.log(res);
      dispatch({ type: GET_TOKEN_SUCCESS, payload: res });
      dispatch(getUserInformation(res));
      startDB(res.id);
    })
    .catch((err) => {
      console.log(err);
      ToastAndroid.show(err.response.data.message, ToastAndroid.SHORT);
    });
};

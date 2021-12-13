import { GET_TOKEN_START, GET_TOKEN_SUCCESS } from "../../actionsName";
import { getUserInformation } from "./getUserInformation";
import { ToastAndroid } from "react-native";
import { fetchHandler } from "../../../helper/helper";
import Database from "../../../db";

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
      dispatch({ type: GET_TOKEN_SUCCESS, payload: res });
      dispatch(getUserInformation(res));
      Database.startDB(res.id);
    })
    .catch((err) => {
      ToastAndroid.show(err.response.data.message, ToastAndroid.SHORT);
    });
};

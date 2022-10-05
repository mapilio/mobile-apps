import { GET_TOKEN_START, GET_TOKEN_SUCCESS } from "../../actionsName";
import { getUserInformation } from "./getUserInformation";
import Database from "../../../db";
import { fetchHandler } from "../../../helper/helper";
import OneSignal from "react-native-onesignal";
import {toastMessage} from "../../../helper/alerts";
import Config from "react-native-config";

export const getTokenAction = (parameters) => (dispatch) => {
  dispatch({ type: GET_TOKEN_START });
  const url = `${Config.SERVICE_URL}/api/login`;
  fetchHandler({
    url: url,
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
      OneSignal.setExternalUserId(res.id.toLocaleString(), (results) => {
        console.log("RESULTS: ", results);
      });
    })
    .catch((err) => {
      toastMessage.error(`${err.response.data.message}`)
    });
};

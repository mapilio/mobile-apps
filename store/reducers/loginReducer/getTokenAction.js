import { GET_TOKEN_START, GET_TOKEN_SUCCESS } from "../../actionsName";
import { getUserInformation } from "./getUserInformation";
import Database from "../../../db";
import { fetchHandler, toastGenerator } from "../../../helper/helper";
import { errorAlertStyles } from "../../../styles/alertStyles";
import { SERVICE_URL } from "@env";
import OneSignal from "react-native-onesignal";

export const getTokenAction = (parameters, navigation) => (dispatch) => {
  dispatch({ type: GET_TOKEN_START });
  const url = `${SERVICE_URL}/api/login`;
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
      toastGenerator(
        `${err.response.data.message}`,
        require("../../../assets/images/Warning.png"),
        errorAlertStyles.alertContainer,
        errorAlertStyles.alertTitle,
        errorAlertStyles.alertImage,
        3000
      );
    });
};

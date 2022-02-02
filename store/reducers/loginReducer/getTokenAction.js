import { GET_TOKEN_START, GET_TOKEN_SUCCESS } from "../../actionsName";
import { getUserInformation } from "./getUserInformation";
import Database from "../../../db";
import {fetchHandler, toastGenerator} from "../../../helper/helper";
import {errorAlertStyles} from "../../../styles/alertStyles";

export const getTokenAction = (parameters, navigation) => (dispatch) => {
  dispatch({ type: GET_TOKEN_START });
  const url = `${process.env.API_URL}/api/login`
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

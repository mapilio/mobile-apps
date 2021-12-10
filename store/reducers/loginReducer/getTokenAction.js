import { GET_TOKEN_START, GET_TOKEN_SUCCESS } from "../../actionsName";
import { getUserInformation } from "./getUserInformation";
import {fetchHandler, startDB, toastGenerator} from "../../../helper/helper";
import {errorAlertStyles} from "../../../styles/alertStyles";

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

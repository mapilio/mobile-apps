import axios from "axios";

import {GET_TOKEN_START, GET_TOKEN_SUCCESS, GET_TOKEN_ERROR} from "../../actionsName";
import {getUserInformation} from "./getUserInformation";

export const getTokenAction = (parameters) => (dispatch) => {
  dispatch({type: GET_TOKEN_START});

  axios
    .post(`https://end.mapilio.com/api/login`, {
      email: parameters.email,
      password: parameters.password,
    })
    .then((response) => {
      if (!response.data.error) {
        dispatch({type: GET_TOKEN_SUCCESS, payload: response.data});
        dispatch(getUserInformation(response.data));
      } else {
        dispatch({
          type: "GET_TOKEN_ERROR",
        });
      }
    })
    .catch((error) => {
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

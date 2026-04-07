import { GET_TOKEN_START, GET_TOKEN_SUCCESS, GET_TOKEN_ERROR } from "../../actionsName";
import { getUserInformation } from "./getUserInformation";
import {api} from "../../../util/helpers/api";

export const getTokenAction = (parameters) => (dispatch) => {
  dispatch({ type: GET_TOKEN_START });

  api.post('/api/login', {
    email: parameters.email,
    password: parameters.password,
  }).then((res) => {
      dispatch({ type: GET_TOKEN_SUCCESS, payload: res });
      dispatch(getUserInformation(res));
    }).catch((err) => {
      const message = err?.response?.data?.message || err?.message || String(err);
      dispatch({ type: GET_TOKEN_ERROR, payload: message });
    });
};

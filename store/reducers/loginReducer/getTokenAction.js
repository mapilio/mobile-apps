import { GET_TOKEN_START, GET_TOKEN_SUCCESS } from "../../actionsName";
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
      toast.show(`${err.response.data.message || err}`, {type: "error"})
    });
};

import {store} from "../store/store";
import {GET_TOKEN_START, GET_TOKEN_SUCCESS} from "../store/actionsName";
import Config from "react-native-config";
import {fetchHandler} from "./helper";
import {getUserInformation} from "../store/reducers/loginReducer/getUserInformation";

export const fetchLogin = async (email, password) => {
  store.dispatch({type: GET_TOKEN_START})
  const url = `${Config.SERVICE_URL}/api/login`;

  try {
    const user = await fetchHandler({url: url, method: "POST", data: {email, password}})
    store.dispatch({type: GET_TOKEN_SUCCESS, payload: user});
    store.dispatch(getUserInformation(user));
    return user
  } catch (err) {
    throw new Error(err.response.data.message || "There was an error with the server, please try again later.");
  }
}

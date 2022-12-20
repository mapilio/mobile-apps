import {store} from "../store/store";
import {GET_TOKEN_START, GET_TOKEN_SUCCESS} from "../store/actionsName";
import Config from "react-native-config";
import {fetchHandler} from "./helper";
import {getUserInformation} from "../store/reducers/loginReducer/getUserInformation";
import Database from "../db";

export const fetchLogin = (email, password) => {
  return new Promise((resolve, reject) => {
    store.dispatch({type: GET_TOKEN_START})
    const url = `${Config.SERVICE_URL}/api/login`;

    fetchHandler({url: url, method: "POST", data: {email, password}}).then(response => {
      store.dispatch({type: GET_TOKEN_SUCCESS, payload: response});
      store.dispatch(getUserInformation(response));
      Database.startDB(response.id);
      resolve(response)
    }).catch((err) => {
      reject(err.response.data.message)
    });
  })
}

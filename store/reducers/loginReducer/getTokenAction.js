import {GET_TOKEN_START} from "../../actionsName";

const getTokenAction = (parameters) => (dispatch) => {
  dispatch({ type: GET_TOKEN_START });

}

export default getTokenAction;
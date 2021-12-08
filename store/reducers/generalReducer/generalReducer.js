import {
    UPDATE_CONNECTION_STATUS,
  } from "../../actionsName";
  
  const INITIAL_STATE = {
    connection: {connectionStatus: true,connectionType:"wifi"},
  };
  
  const generalReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case UPDATE_CONNECTION_STATUS:
        return {
          ...state,
          connection: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default generalReducer;
  
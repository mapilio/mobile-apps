import {
  GET_TOKEN_ERROR,
  GET_TOKEN_START,
  GET_TOKEN_SUCCESS,
  GET_USER_INDEX_TYPE,
  GET_USER_INFORMATION,
  EXIT_USER,
  SET_CREDENTIAL,
} from '../../actionsName';

const INITIAL_STATE = {
  isLoading: false,
  auth: null,
  userInformation: null,
  error: false,
  accountType: null,
  credential: undefined,
  sessionVersion: 0,
};

const auth = (state = INITIAL_STATE, actions) => {
  switch (actions.type) {
    case GET_TOKEN_START:
      return {
        ...state,
        sessionVersion: (state.sessionVersion ?? 0) + 1,
        isLoading: true,
        error: false,
        auth: null,
        userInformation: null,
      };
    case GET_TOKEN_SUCCESS: {
      const isTokenRefresh = actions.meta?.isTokenRefresh && state.auth && actions.payload;
      return {
        ...state,
        sessionVersion: isTokenRefresh
          ? (state.sessionVersion ?? 0)
          : (state.sessionVersion ?? 0) + 1,
        auth: actions.payload,
        userInformation: isTokenRefresh ? state.userInformation : null,
        isLoading: false,
        error: false,
      };
    }
    case GET_TOKEN_ERROR:
      return {
        ...state,
        error: actions.payload,
      };
    case GET_USER_INFORMATION:
      return {
        ...state,
        userInformation: actions.payload,
        isLoading: false,
        error: false,
      };
    case GET_USER_INDEX_TYPE:
      return {
        ...state,
        accountType: actions.payload,
      };
    case SET_CREDENTIAL:
      return {
        ...state,
        credential: actions.payload,
      };
    case EXIT_USER:
      return {
        ...state,
        sessionVersion: (state.sessionVersion ?? 0) + 1,
        isLoading: false,
        auth: null,
        userInformation: null,
        error: false,
        accountType: null,
        credential: undefined,
      };
    default:
      return state;
  }
};

export default auth;

import {
  GET_LEADERBOARD_DATA_ORGANIZATIONS,
  GET_LEADERBOARD_DATA_USERS, SET_SHOW_GIFTS,
} from "../../actionsName";

const INITIAL_STATE = {
  users: null,
  organizations: null,
  showGifts: true,
};

const leaderboardReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_LEADERBOARD_DATA_USERS:
      return {
        ...state,
        users: action.payload,
      };
    case GET_LEADERBOARD_DATA_ORGANIZATIONS:
      return {
        ...state,
        organizations: action.payload,
      };
    case SET_SHOW_GIFTS:
      return {
        ...state,
        showGifts: action.payload,
      }
    default:
      return state;
  }
};

export default leaderboardReducer;

import {
  SET_LEADERBOARD_ORGANIZATIONS,
  SET_LEADERBOARD_USERS,
  RESET_LEADERBOARD,
  SET_SHOW_GIFTS,
  SET_LEADERBOARD_CHALLANGE_USERS,
} from "../../actionsName";

const INITIAL_STATE = {
  users: null,
  organizations: null,
  showGifts: true,
  challangeUsers: null,
};

const leaderboardReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_LEADERBOARD_USERS:
      return {
        ...state,
        users: action.payload,
      };
    case SET_LEADERBOARD_ORGANIZATIONS:
      return {
        ...state,
        organizations: action.payload,
      };
    case SET_LEADERBOARD_CHALLANGE_USERS:
      return {
        ...state,
        challangeUsers: action.payload,
      };
    case RESET_LEADERBOARD:
      return {
        ...state,
        users: null,
        organizations: null,
        challangeUsers: null,
      };
    case SET_SHOW_GIFTS:
      return {
        ...state,
        showGifts: action.payload,
      };

    default:
      return state;
  }
};

export default leaderboardReducer;

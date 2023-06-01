import {
  SET_LEADERBOARD_ORGANIZATIONS,
  SET_LEADERBOARD_USERS,
  RESET_LEADERBOARD,
  SET_SHOW_GIFTS,
  SET_LEADERBOARD_CHALLENGE_USERS,
  SET_LEADERBOARD_CHALLENGE_WINNERS,
} from "../../actionsName";

const INITIAL_STATE = {
  users: null,
  organizations: null,
  showGifts: true,
  challangeUsers: null,
  challengeWinners: {
    is_calculated: false,
    winners: [],
  },
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
    case SET_LEADERBOARD_CHALLENGE_USERS:
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
      case SET_LEADERBOARD_CHALLENGE_WINNERS:
        return {
          ...state,
          challengeWinners: action.payload,
        };

    default:
      return state;
  }
};

export default leaderboardReducer;

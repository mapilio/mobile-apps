import {
  SET_LEADERBOARD_ORGANIZATIONS,
  SET_LEADERBOARD_USERS,
  RESET_LEADERBOARD,
  SET_LEADERBOARD_CHALLENGE_USERS,
  SET_LEADERBOARD_CHALLENGE_WINNERS,
  SET_LEADERBOARD_USERS_MONTH,
  SET_LEADERBOARD_USERS_WEEK,
} from '../../actionsName';

const INITIAL_STATE = {
  users: null,
  usersMonth: null,
  usersWeek: null,
  organizations: null,
  challengeUsers: null,
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
    case SET_LEADERBOARD_USERS_MONTH:
      return {
        ...state,
        usersMonth: action.payload,
      };
    case SET_LEADERBOARD_USERS_WEEK:
      return {
        ...state,
        usersWeek: action.payload,
      };
    case SET_LEADERBOARD_ORGANIZATIONS:
      return {
        ...state,
        organizations: action.payload,
      };
    case SET_LEADERBOARD_CHALLENGE_USERS:
      return {
        ...state,
        challengeUsers: action.payload,
      };
    case RESET_LEADERBOARD:
      return {
        ...state,
        users: null,
        organizations: null,
        challangeUsers: null,
        usersMonth: null,
        usersWeek: null,
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

import {
  SET_LEADERBOARD_USERS,
  SET_LEADERBOARD_ORGANIZATIONS,
  RESET_LEADERBOARD,
  SET_LEADERBOARD_CHALLENGE_USERS,
  SET_LEADERBOARD_CHALLENGE_WINNERS,
  SET_LEADERBOARD_USERS_MONTH,
  SET_LEADERBOARD_USERS_WEEK,
} from "../../actionsName";
import { translate } from "../../../util/helpers";
import {api} from "../../../util/helpers/api";

export const resetLeaderboard = () => {
  return {
    type: RESET_LEADERBOARD,
  };
};

/**
 * 
 * @param { string } startDate 
 * @param { string } endDate
 * @returns { void }
 * @example  fetchLeaderUsers("2020-01-01", "2020-01-31", true)
 * @example  fetchLeaderUsers() // for all time
 */
export const fetchLeaderUsers = (startDate, finishDate, isChallenge) => {


  let date = "";
  if (startDate && finishDate) {
    date = `?start_at=${startDate}&finish_at=${finishDate}`;
  }

  return (dispatch) => {
    api.get(`/api/leaderboard${date}`)
      .then((res) => {
        dispatch({
          type: isChallenge ? SET_LEADERBOARD_CHALLENGE_USERS : SET_LEADERBOARD_USERS,
          payload: res.data.leaderboard,
        });
      })
      .catch(() => {
        toast.show(translate("fetch_error", "leaderboard"), { type: "warning" });
      });
  };
};


export const fetchLeaderUsersMonth = () => {

  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const dayOfMonth = date.getDate();

  const firstDayOfLastMonth = new Date(year, month, dayOfMonth - 30).toISOString().split('T')[0];
  const lastDayOfLastMonth = new Date(year, month, dayOfMonth + 1).toISOString().split('T')[0];

  return (dispatch) => {
    api.get(`/api/leaderboard?start_at=${firstDayOfLastMonth}&finish_at=${lastDayOfLastMonth}`)
      .then((res) => {
        dispatch({
          type: SET_LEADERBOARD_USERS_MONTH,
          payload: res.data.leaderboard,
        });
      })
      .catch(() => {
        toast.show(translate("fetch_error", "leaderboard"), { type: "warning" });
      });
  };
}

export const fetchLeaderUsersWeek = () => {

  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const dayOfMonth = date.getDate();

  const firstDayOfLastWeek = new Date(year, month, dayOfMonth - 6).toISOString().split('T')[0];
  const lastDayOfLastWeek = new Date(year, month, dayOfMonth + 1).toISOString().split('T')[0];


  return (dispatch) => {
    api.get(`/api/leaderboard?start_at=${firstDayOfLastWeek}&finish_at=${lastDayOfLastWeek}`)
      .then((res) => {
        dispatch({
          type: SET_LEADERBOARD_USERS_WEEK,
          payload: res.data.leaderboard,
        });
      })
      .catch(() => {
        toast.show(translate("fetch_error", "leaderboard"), { type: "warning" });
      });
  }
}

export const fetchLeaderOrganizations = () => {
  return (dispatch) => {
    api.get(`/api/leaderboard-organization`)
      .then((res) => {
        dispatch({
          type: SET_LEADERBOARD_ORGANIZATIONS,
          payload: res.data.leaderboard,
        });
      })
      .catch(() => {
        toast.show(translate("fetch_error", "leaderboard"),{ type: "warning" });
      });
  };
};

export const fetchLeaderboardWinners = (startDate, finishDate) => {

  const today = new Date()
  const finishDateParsed = new Date(finishDate)
  
  if(today < finishDateParsed){
    return (dispatch) => {
      dispatch({
        type: SET_LEADERBOARD_CHALLENGE_WINNERS,
        payload: {
          is_calculated: false,
          winners: [],
        },
      })
    }
  }

  let date = "";
  if (startDate && finishDate) {
    date = `?start_at=${startDate}&finish_at=${finishDate}`;
  }
  return (dispatch) => {
    api
      .get(`/api/leaderboard-winner${date}`)
      .then((res) => {
        
        if(res.data){
          dispatch({
            type: SET_LEADERBOARD_CHALLENGE_WINNERS,
            payload: res.data,
          });
        }
      })
      .catch(() => {
        toast.show(translate("fetch_error", "leaderboard"), {
          type: "warning",
        });
      });
  };
};
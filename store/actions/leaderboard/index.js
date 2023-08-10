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
export const fetchLeaderUsers = (startDate, finishDate, isChallange) => {


  let date = "";
  if (startDate && finishDate) {
    date = `?start_at=${startDate}&finish_at=${finishDate}`;
  }

  return (dispatch) => {
    api.get(`/api/leaderboard${date}`)
      .then((res) => {
        dispatch({
          type: isChallange ? SET_LEADERBOARD_CHALLENGE_USERS : SET_LEADERBOARD_USERS,
          payload: res.data.leaderboard,
        });
      })
      .catch(() => {
        toast.show(translate("fetch_error", "leaderboard"), { type: "warning" });
      });
  };
};


export const fetchLeaderUsersMonth = () => {

  const firstDayOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 2).toISOString().split('T')[0];
  const lastDayOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];

  return (dispatch) => {
    api.get(`/api/leaderboard?start_at=${firstDayOfCurrentMonth}&finish_at=${lastDayOfCurrentMonth}`)
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
  const firstDayOfCurrentWeek = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - new Date().getDay() + 1).toISOString().split('T')[0];
  const lastDayOfCurrentWeek = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - new Date().getDay() + 7).toISOString().split('T')[0];

  return (dispatch) => {
    api.get(`/api/leaderboard?start_at=${firstDayOfCurrentWeek}&finish_at=${lastDayOfCurrentWeek}`)
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
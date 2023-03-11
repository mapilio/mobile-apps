import {
  SET_LEADERBOARD_USERS,
  SET_LEADERBOARD_ORGANIZATIONS,
  RESET_LEADERBOARD,
  SET_LEADERBOARD_CHALLANGE_USERS,
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
 * @example  fetchLeaderUsers("2020-01-01", "2020-01-31")
 * @example  fetchLeaderUsers() // for all time
 */
export const fetchLeaderUsers = (startDate, finishDate) => {

  let date = "";
  if (startDate && finishDate) {
    date = `?start_at=${startDate}&finish_at=${finishDate}`;
  }

  return (dispatch) => {
    api.get(`/api/leaderboard${date}`)
      .then((res) => {
        dispatch({
          type: date ? SET_LEADERBOARD_CHALLANGE_USERS : SET_LEADERBOARD_USERS,
          payload: res.data.leaderboard,
        });
      })
      .catch(() => {
        toast.show(translate("fetch_error", "leaderboard"), { type: "warning" });
      });
  };
};

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

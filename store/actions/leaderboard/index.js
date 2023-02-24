import {
  SET_LEADERBOARD_USERS,
  SET_LEADERBOARD_ORGANIZATIONS,
  RESET_LEADERBOARD,
} from "../../actionsName";
import { translate } from "../../../util/helpers";
import {api} from "../../../util/helpers/api";

export const resetLeaderboard = () => {
  return {
    type: RESET_LEADERBOARD,
  };
};

export const fetchLeaderUsers = () => {
  return (dispatch) => {
    api.get(`/api/leaderboard`)
      .then((res) => {
        dispatch({
          type: SET_LEADERBOARD_USERS,
          payload: res.data.leaderboard.slice(0, 30),
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

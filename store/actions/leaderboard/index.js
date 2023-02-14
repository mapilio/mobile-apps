import {
  SET_LEADERBOARD_USERS,
  SET_LEADERBOARD_ORGANIZATIONS,
  RESET_LEADERBOARD,
} from "../../actionsName";
import { fetchHandler } from "../../../helper/helper";
import Config from "react-native-config";
import { translate } from "../../../util/helpers";

export const resetLeaderboard = () => {
  return {
    type: RESET_LEADERBOARD,
  };
};

export const fetchLeaderUsers = () => {
  return (dispatch) => {
    fetchHandler({ url: `${Config.SERVICE_URL}/api/leaderboard` })
      .then((res) => {
        dispatch({
          type: SET_LEADERBOARD_USERS,
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
    fetchHandler({ url: `${Config.SERVICE_URL}/api/leaderboard-organization` })
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

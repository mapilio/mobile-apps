import axios from "axios";
import {GET_USER_INFORMATION} from "../../actionsName";

export const getUserInformation = (auth) => (dispatch) => {
  const token = auth.token;
  const user_id = auth.id;

  axios
    .get(
      `https://end.mapilio.com/api/entries/users/users/${user_id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((response) => {
      const userInfo = response.data.data;
      dispatch({
        type: "GET_USER_INDEX_TYPE",
        payload: {
          index: 0,
          type: {
            accountType: "Individual",
            displayName: userInfo.display_name,
            picture: userInfo.user_profile_photo,
            username: userInfo.username,
            key: userInfo.str_id,
            id: userInfo.id,
            bio: userInfo.user_bio,
          },
        },
      });
      dispatch({ type: GET_USER_INFORMATION, payload: userInfo });
    });
};

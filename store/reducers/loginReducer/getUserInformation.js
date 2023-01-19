import {GET_USER_INDEX_TYPE, GET_USER_INFORMATION} from "../../actionsName";
import Config from "react-native-config";
import OneSignal from "react-native-onesignal";
import {fetchHandler} from "../../../helper/helper";

export const getUserInformation = () => (dispatch) => {
  fetchHandler({url: `${Config.SERVICE_URL}/api/function/user_profile/profile/getProfile`}).then(({data}) => {

    const {id, email, display_name, user_profile_photo, username, str_id, user_bio, meters} = data[0]

    dispatch({
      type: GET_USER_INDEX_TYPE,
      payload: {
        index: 0,
        type: {
          accountType: "Individual",
          displayName: display_name,
          picture: user_profile_photo,
          username: username,
          key: str_id,
          id: id,
          bio: user_bio,
          meters: meters
        }
      }
    })

    dispatch({type: GET_USER_INFORMATION, payload: data[0]});
    OneSignal.setExternalUserId(id.toString())
    OneSignal.setEmail(email)
  })
};

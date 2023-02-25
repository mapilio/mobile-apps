import {Text, View, Alert, Modal, ActivityIndicator} from "react-native";
import {SadWorld} from "../../assets/svg/illustrations";
import styles from "./DeleteAccount.styles";
import {Button, FocusAwareStatusBar, Loading} from "../../components";
import {Routes} from "../../navigator/Routes";
import {EXIT_USER} from "../../store/actionsName";
import OneSignal from "react-native-onesignal";
import {useDispatch, useSelector} from "react-redux";
import {useNavigation} from "@react-navigation/native";
import {useTranslation} from "react-i18next";
import * as AppleAuthentication from "expo-apple-authentication";
import {useState} from "react";
import {api} from "../../util/helpers/api";


const DeleteAccount = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {t} = useTranslation("delete_account");
  const {credential} = useSelector((state) => state.getTokenReducer);
  const [loading, setLoading] = useState(false);

  const deleteFetch = async (data) => {
    try {
      await api.post(`/api/function/user_profile/profile/delete-account`, {options: {parameters: data}})

      navigation.navigate(Routes.tabNavigator, {screen: Routes.map});
      dispatch({type: EXIT_USER});
      OneSignal.removeExternalUserId();

    } catch (e) {
      throw new Error(e)
    }
  }

  const deleteHandler = async () => {
    setLoading(true);

    if (typeof credential === "undefined") {
      Alert.alert(
        t("login_again"),
        t("login_again_description"),
        [
          {text: t("cancel")},
          {text: t("ok"), onPress: () => navigation.navigate(Routes.stackNavigator, {screen: Routes.auth})}
        ],
      )

      setLoading(false);

      return {status: 'success'};
    }

    try {
      if (credential.type === 'apple') {
        const credentialState = await AppleAuthentication.getCredentialStateAsync(credential.user);

        if (credentialState === AppleAuthentication.AppleAuthenticationCredentialState.AUTHORIZED) {
          const {authorizationCode} = await AppleAuthentication.refreshAsync({user: credential.user});
          authorizationCode && await deleteFetch({delete: true, auth_code: authorizationCode, login_type: 'apple'});

          return {status: 'success'};
        }
      }

      // TODO: Add Google and Facebook delete account logic here

      await deleteFetch({delete: true, login_type: 'default'})

      setLoading(false);

    } catch (e) {
      toast.show(t("delete_error"), {type: "error"});
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar barStyle="dark-content"  />
      <View style={styles.content}>
        <SadWorld />
        <Text style={styles.title}>{t("title")}</Text>
        <Text style={styles.description}>{t("description")}</Text>
      </View>

      <Button
        title={t("delete_account")}
        containerStyle={styles.button}
        disabled={loading}
        loading={loading}
        onPress={() => {
          Alert.alert(
            t("alert_title"),
            t("alert_description"),
            [{text: t("cancel")}, {text: t("delete"), onPress: deleteHandler}]
          )
        }}
      />
    </View>
  );
}

export default DeleteAccount;

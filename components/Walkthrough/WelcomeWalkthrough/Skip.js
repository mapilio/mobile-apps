import { StyleSheet, View, TouchableOpacity } from "react-native";
import { CustomText } from "../../../highordercomponents";
import { RFValue } from "react-native-responsive-fontsize";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { UPDATE_WELCOME_WALKTHROUGH_STATUS } from "../../../store/actionsName";
import { Routes } from "../../../navigator/Routes";
import { useTranslation } from "react-i18next";

const Skip = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { t } = useTranslation("welcome_walkthrough");

  const onPress = () => {
    dispatch({ type: UPDATE_WELCOME_WALKTHROUGH_STATUS, payload: true });
    navigation.navigate(Routes.tabNavigator, { screen: Routes.map });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <CustomText style={styles.text}>{t("skip")}</CustomText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "10%",
    width: "100%",
    paddingRight: RFValue(35),
    paddingTop: RFValue(10),
  },
  text: {
    textAlign: "right",
    fontSize: RFValue(18),
    color: "#666666",
  },
});

export default Skip;

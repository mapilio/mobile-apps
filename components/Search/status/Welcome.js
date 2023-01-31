import { View, Text, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { SearchWelcome } from "../../../assets/svg/illustrations";
import { useTranslation } from "react-i18next";

const Welcome = () => {
  const { t } = useTranslation("search");

  return (
    <View style={styles.wrapper}>
        <SearchWelcome width={RFValue(200)} height={RFValue(200)} />
      <Text style={styles.text}>
        {t("empty_search")}
     </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: RFValue(40),
  },

  text: {
    color: "#666666",
    fontSize: RFValue(14),
    justifyContent: "center",
    marginTop: RFValue(10),
  },
});

export default Welcome;

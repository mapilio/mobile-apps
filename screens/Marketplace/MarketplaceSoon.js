import { View, Image, StyleSheet } from "react-native";
import { CustomText, CustomTextBold } from "../../highordercomponents";
import { RFValue } from "react-native-responsive-fontsize";
import { FocusAwareStatusBar } from "../../components";
import LinearGradient from "react-native-linear-gradient";
import { MarketplaceSoonIcon } from "../../assets/svg/illustrations";
import { useTranslation } from "react-i18next";

const MarketplaceSoon = () => {
  const { t } = useTranslation("marketplace");
  return (
    <View style={styles.container}>
      <FocusAwareStatusBar
        barStyle="dark-content"
        translucent
        backgroundColor={"#fff"}
      />
      <View>
        <MarketplaceSoonIcon />
        <LinearGradient
          colors={[
            "#FFFFFF00",
            "#FFFFFF24",
            "#FFFFFF42",
            "#FFFFFF91",
            "#FFFFFFC7",
            "#FFFFFFE7",
            "#FFFFFFEF",
            "#FFFFFFF7",
          ]}
          style={styles.content.gradient}
        />
        <View style={styles.row}>
          <CustomText style={styles.content.soon}>{t("very_soon")}</CustomText>
          <Image
            style={{
              width: RFValue(22),
              height: RFValue(22),
              marginLeft: RFValue(5),
            }}
            source={require("../../assets/images/marketplace/sugar.png")}
          />
          <Image
            style={{
              width: RFValue(22),
              height: RFValue(22),
              marginLeft: RFValue(5),
            }}
            source={require("../../assets/images/tooltip/capture.png")}
          />
        </View>
      </View>

      <CustomTextBold style={styles.content.marketplace}>
        {t("marketplace")}
      </CustomTextBold>

      <CustomText style={styles.content.description}>
        {t("soon_description")}
      </CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: RFValue(25),
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  content: {
    soon: {
      fontSize: RFValue(16),
      color: "#808080",
    },
    marketplace: {
      color: "#191919",
      fontSize: RFValue(26),
      marginTop: RFValue(7),
    },
    description: {
      marginTop: RFValue(5),
      color: "#808080",
      fontSize: RFValue(14),
      textAlign: "center",
    },
    gradient: {
      position: "absolute",
      width: "100%",
      height: "50%",
      opacity: 0.9,
      bottom: 0,
    },
  },
});

export default MarketplaceSoon;

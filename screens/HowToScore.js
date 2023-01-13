import {Image, ScrollView, StyleSheet, Text, TouchableOpacity} from "react-native";
import {RFPercentage, RFValue} from "react-native-responsive-fontsize";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useNavigation} from "@react-navigation/native";
import {Routes} from "../navigator/Routes";
import {Trans, useTranslation} from "react-i18next";

const StartCaptureButton = ({style}) => {
  const navigation = useNavigation();
  const {t} = useTranslation("how_to_score");

  const handlePress = () => navigation.navigate(Routes.cameraTab)

  return (
    <TouchableOpacity style={{...styles.captureButton, ...style}} onPress={handlePress}>
      <Text style={styles.captureButton.text}>
        {t("start_now_capture")}
      </Text>
    </TouchableOpacity>
  )
}

const HowToScore = () => {
  const {bottom} = useSafeAreaInsets();
  const {t} = useTranslation("how_to_score")

  return (
    <ScrollView style={{...styles.wrapper, paddingBottom: bottom}}>
      <Text style={styles.h1}>
        {t("title")}
      </Text>

      <Text style={styles.summary}>
        {t("summary")}
      </Text>

      <Image
        source={require("../assets/images/medals.png")}
        resizeMode={"contain"}
        style={styles.medals}
      />

      <StartCaptureButton />

      <Text>
        <Trans
          t={t}
          i18nKey="paragraph"
          components={{
            h2: <Text style={styles.h2}/>,
            h3: <Text style={styles.h3}/>,
            h3center: <Text style={{...styles.h3, ...styles.center}}/>,
            p: <Text style={styles.paragraph}/>
          }}
        />
      </Text>

      <StartCaptureButton style={styles.mb100} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: RFValue(20),
    paddingVertical: RFValue(10),
  },
  h1: {
    color: "#130C47",
    fontSize: RFValue(24),
    fontWeight: "700",
    textAlign: "center",
    fontFamily: "Poppins-SemiBold"
  },
  h2: {
    color: "#2D3748",
    fontFamily: "Poppins-SemiBold",
    fontSize: RFValue(18),
    marginBottom: RFValue(15)
  },
  h3: {
    color: "#2D3748",
    fontFamily: "Poppins-SemiBold",
    fontSize: RFValue(12),
    marginTop: RFValue(10),
  },
  summary: {
    color: '#666',
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Poppins",
    padding: RFValue(10)
  },
  paragraph: {
    color: "#2D3748",
    fontFamily: "Poppins",
    fontSize: RFValue(12),
    marginBottom: RFValue(15),
  },
  medals: {
    width: RFValue(112),
    marginLeft: "auto",
    marginRight: "auto"
  },
  captureButton: {
    backgroundColor: "#3F8BE9",
    borderRadius: RFPercentage(50),
    width: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    alignItems: "center",
    paddingHorizontal: RFValue(25),
    paddingVertical: RFValue(10),
    marginTop: RFValue(15),
    marginBottom: RFValue(25),

    text: {
      color: "#FFF",
      fontSize: RFValue(14),
    }
  },
  center: {
    textAlign: "center",
    paddingHorizontal: RFValue(12),
  },
  mb100: {
    marginBottom: RFValue(100)
  }
})

export default HowToScore;

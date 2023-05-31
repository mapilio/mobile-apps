import {
  Image,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import Lottie from "lottie-react-native";
import { Fragment } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { Button, FocusAwareStatusBar } from "../../components";
import { Trans, useTranslation } from "react-i18next";
import { CustomTextBold } from "../../highordercomponents";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "../../navigator/Routes";
import LinearGradient from "react-native-linear-gradient";
import { AwardCompanies } from "../../assets/svg/illustrations";

const Content = ({slidePanel}) => {
  const awards = [
    {
      medal: require("../../assets/images/goldMedal.png"),
      title: "mi_pro_2_scooter",
    },
    { medal: require("../../assets/images/silverMedal.png"), title: "gopro_9" },
    {
      medal: require("../../assets/images/bronzeMedal.png"),
      title: "beats_3_headphones",
    },
  ];

  const { t } = useTranslation("award");
  const navigation = useNavigation();
  const pressHandler = () => navigation.navigate(Routes.cameraTab);

  const { width, height } = useWindowDimensions();

  const styles = StyleSheet.create({
    bold: {
      fontFamily: "Poppins-SemiBold",
    },
    fs30: {
      fontSize: RFValue(30),
    },
    slogan: {
      fontFamily: "Poppins",
      textAlign: "center",
      marginBottom: RFValue(24),
      color:"#191919"
    },
    confetti: {
      position: "absolute",
      zIndex: -1,
      height: height * 0.4,
      width: width,
    },
    awardImage: {
      width: width,
      height: height * 0.35,
      zIndex: -2,
      alignItems: "center",
      resizeMode: "contain",
    },
    summary: {
      fontFamily: "Poppins-SemiBold",
      fontSize: RFValue(24),
      lineHeight: RFValue(36),
      textAlign: "center",
      color: "#191919",
      paddingTop: RFValue(18),
      paddingHorizontal: RFValue(25),
      marginBottom: RFValue(10),
    },
    title: {
      color: "#191919",
      fontSize: RFValue(20),
      fontFamily: "Poppins-SemiBold",
      marginBottom: RFValue(10),
    },
    button: {
      width: RFValue(223),
      marginVertical: RFValue(20),
      marginLeft: "auto",
      marginRight: "auto",
      backgroundColor:"#0056F1"
    },
    description: {
      color: "#808080",
      fontFamily: "Poppins",
    },
    date: {
      color: "#191919",
      fontFamily: "Poppins-Medium",
      textDecorationLine: "underline",
    },
    awardList: {
      flexDirection: "column",
      borderWidth: 1,
      borderColor: "#E5E5E5",
      borderRadius: RFValue(20),
      padding: RFValue(10),
      marginVertical: RFValue(20),
      marginHorizontal: RFValue(20),
    },
    awardItem: {
      flexDirection: "row",
      alignItems: "flex-end",
      marginVertical: RFValue(5),
      marginHorizontal: RFValue(15),

      text: {
        fontFamily: "Poppins-SemiBold",
        fontSize: RFValue(14),
        color: "#191919",
      },
    },
    content: {
      color: "#191919",
      fontFamily: "Poppins",
      fontSize: RFValue(12),

      title: {
        fontFamily: "Poppins-SemiBold",
        color: "#191919",
        fontSize: RFValue(16),
      },
    },
    finalContent: {
      title: {
        fontFamily: "Poppins-SemiBold",
        color: "#191919",
        fontSize: RFValue(16),
        textAlign: "center",
        marginBottom: RFValue(10),
        marginTop: RFValue(10),
      },
      description: {
        fontFamily: "Poppins",
        color: "#191919",
        fontSize: RFValue(12),
        textAlign: "center",
      },
    },
    bottomContent: {
      transform: [{ scale: 1.3 }, { translateX: 16 }],
      paddingTop: RFValue(10),
      gradient: {
        position: "absolute",
        flex: 1,
        width: "100%",
        height: "50%",
        opacity: 0.8,
        bottom:0
      },
    },
    rules: {
      color: "#191919",
      fontFamily: "Poppins",
      fontSize: RFValue(14),
      textAlign: "center",
      marginHorizontal: RFValue(20),
      paddingHorizontal: RFValue(20),
      marginBottom: RFValue(10),

      link: {
        color: "#0056F1",
        fontFamily: "Poppins-Medium",
        textDecorationLine: "underline",
      },
    },
  });

  return (
    <Fragment>
      <FocusAwareStatusBar barStyle="dark-content" translucent backgroundColor={"#fff"} />
      <Lottie
        source={require("../../assets/animations/award.json")}
        style={styles.confetti}
        resizeMode={"cover"}
        loop={false}
        autoPlay
      />
      <Image
        source={require("../../assets/images/awardImage.png")}
        style={styles.awardImage}
      />

      <Fragment>
        <Text style={styles.summary}>
          <Trans
            t={t}
            components={[<Text style={styles.fs30} />]}
            i18nKey={"summary"}
          />
        </Text>

        <Button
          title={t("start_capture_now")}
          containerStyle={styles.button}
          onPress={pressHandler}
        />

        <Text style={styles.slogan}>
          <Trans
            t={t}
            components={{ bold: <CustomTextBold /> }}
            i18nKey={"slogan"}
          />
        </Text>

        <View style={{ paddingHorizontal: RFValue(16) }}>
          <Text style={styles.title}>{t("title")}</Text>

          <Text style={styles.description}>
            <Trans
              t={t}
              i18nKey={"description"}
              components={{ date: <Text style={styles.date} /> }}
            />
          </Text>

          <View style={styles.awardList}>
            {awards.map((item, index) => (
              <View style={styles.awardItem} key={index}>
                <Image source={item.medal} style={styles.medalIcon} />
                <Text style={styles.awardItem.text} numberOfLines={1}>
                  {t(item.title)}
                </Text>
              </View>
            ))}
          </View>

          <Text style={styles.content}>
            <Trans
              t={t}
              i18nKey={"content"}
              components={{
                title: <Text style={styles.content.title} />,
                bold: <Text style={styles.bold} />,
              }}
            />
          </Text>

          <Button
            title={t("start_capture_now")}
            containerStyle={styles.button}
            onPress={pressHandler}
          />

          <TouchableOpacity onPress={() => {
            slidePanel?.current && slidePanel.current.dismiss();

            navigation.navigate(Routes.stackNavigator, {
              screen: Routes.profileNavigator, params: {
                screen: Routes.webview, params: {url: "https://mapilio.com/rules-of-contest-webview"}
              }
            })
          }}>
            <Text style={styles.rules}>
              <Trans
                t={t}
                i18nKey={"rules_of_contest"}
                components={[<Text style={styles.rules.link}/>]}
              />
            </Text>
          </TouchableOpacity>

          <View style={styles.finalContent}>
            <Text style={styles.finalContent.title}>
              {t("final_content.title")}
            </Text>
            <Text style={styles.finalContent.description}>
              {t("final_content.description")}
            </Text>
          </View>
        </View>

        <View style={styles.bottomContent}>
          <AwardCompanies width={width} height={(width * .75)} />

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
            style={styles.bottomContent.gradient}
          />
        </View>
      </Fragment>
    </Fragment>
  );
};

export default Content;

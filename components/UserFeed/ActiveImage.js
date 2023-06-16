import { View, StyleSheet, ImageBackground } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Config from "react-native-config";
import { ArrowLeft, ToggleOrientation } from "../../assets/svg/illustrations";
import { CustomText, CustomTextBold } from "../../highordercomponents";
import LinearGradient from "react-native-linear-gradient";
import { dateConvert } from "../../helper/helper";
import LogoWatermark from "../../assets/svg/illustrations/LogoWatermark";

const ActiveImage = ({
  imgCode,
  filename,
  sequenceName = "Deneme",
  captureDate,
  totalImages = 34,
  activeImageIndex = 12,
}) => {
  const uri = `${Config.IMAGE_API}/${imgCode}/${filename}/1080`;

  return (
    <View style={styles.imageWrapper}>
      <ImageBackground
        source={{ uri }}
        style={{ flex: 1 }}
        imageStyle={styles.activeImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.5)"]}
          style={styles.gradientBackground}
        />

        <View style={styles.count}>
          <CustomTextBold style={styles.h1}>
            {activeImageIndex + 1}/{totalImages}
          </CustomTextBold>
        </View>

        <View style={[styles.buttonBase, styles.rotateButton]}>
          <ToggleOrientation
            color="white"
            width={RFValue(20)}
            height={RFValue(20)}
          />
        </View>

        <View style={[styles.buttonBase, styles.leftButton]}>
          <ArrowLeft color="white" width={RFValue(15)} height={RFValue(15)} />
        </View>

        <View style={[styles.buttonBase, styles.rightButton]}>
          <ArrowLeft color="white" width={RFValue(15)} height={RFValue(15)} />
        </View>

        <View style={styles.infoArea}>
          <CustomTextBold style={styles.h1}>
            {sequenceName ? sequenceName : "No Addres"}
          </CustomTextBold>
          <CustomText style={styles.h2}>
            {dateConvert(captureDate, "MMM DD, YYYY - HH:mm")}
          </CustomText>
          <LogoWatermark width={60} height={18} />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    height: "100%",
    width: "100%",
    position: "absolute",
    zIndex: 3,
    backgroundColor: "#fff",
  },
  activeImage: {
    height: "100%",
    width: "auto",
    borderTopLeftRadius: RFValue(10),
    borderTopRightRadius: RFValue(10),
  },
  gradientBackground: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
  },
  count: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: RFValue(10),
  },
  h1: { color: "#fff", fontSize: RFValue(16) },
  h2: { color: "#fff", fontSize: RFValue(14) },
  rotateButton: {
    top: RFValue(10),
    right: RFValue(10),
  },
  buttonBase: {
    position: "absolute",
    zIndex: 2,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: RFValue(10),
    borderRadius: RFValue(50),
  },
  leftButton: {
    top: "45%",
    left: 10,
  },
  rightButton: {
    top: "45%",
    right: 10,
    transform: [{ rotateY: "180deg" }],
  },
  infoArea: {
    flex: 1,
    justifyContent: "flex-end",
    padding: RFValue(20),
    paddingBottom: RFValue(20),
  },
});

export default ActiveImage;

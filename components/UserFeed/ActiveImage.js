import { View, StyleSheet, ImageBackground , TouchableOpacity, Platform} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Config from "react-native-config";
import { ArrowLeft, ToggleOrientation } from "../../assets/svg/illustrations";
import { CustomText, CustomTextBold } from "../../highordercomponents";
import LinearGradient from "react-native-linear-gradient";
import { dateConvert, maxCharacterHandler } from "../../helper/helper";
import LogoWatermark from "../../assets/svg/illustrations/LogoWatermark";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect } from "react";
import * as ScreenOrientation from "expo-screen-orientation";

  const ActiveImage = ({
  imgCode,
  filename,
  sequenceName = "Deneme",
  captureDate,
  totalImages,
  activeImageIndex,
  changeImage,
  setModalVisible,
  isFullScreen
}) => {
  const uri = `${Config.IMAGE_API}/${imgCode}/${filename}/1080`;
  const {top} = useSafeAreaInsets();
  const isAndroid = Platform.OS === "android";

  useEffect(() => {
    if (isAndroid && isFullScreen) {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
      );
    }
  }, []);


  const toggleClose = async()=>{
    if (isAndroid && isFullScreen) {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    }
    setModalVisible((prev) => !prev);
  }
  return (
    <View style={styles.imageWrapper}>
      <ImageBackground
        source={{ uri }}
        style={{ flex: 1, backgroundColor:"#fff" }}
        imageStyle={styles.activeImage}
        resizeMode="cover"
        progressiveRenderingEnabled
      >
        <LinearGradient
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.5)"]}
          style={styles.gradientBackground}
        />
        <LinearGradient
          colors={["rgba(0,0,0,0.25)","rgba(0,0,0,0)"]}
          style={styles.gradientBackgroundTop}
        />

        <View style={[{flex:1}, isFullScreen && {marginHorizontal:top}]}>
        <View style={styles.count}>
          <CustomTextBold style={styles.h1}>
            {activeImageIndex + 1}/{totalImages}
          </CustomTextBold>
        </View>

        <TouchableOpacity style={[styles.buttonBase, styles.rotateButton, isFullScreen && isAndroid && {top}]} onPress={toggleClose}>
          <ToggleOrientation
            color="white"
            width={RFValue(20)}
            height={RFValue(20)}
          />
        </TouchableOpacity>
        

        <TouchableOpacity style={[styles.buttonBase, styles.leftButton]} onPress={()=>{
          changeImage("prev")
        }}>
          <ArrowLeft color="white" width={RFValue(15)} height={RFValue(15)} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.buttonBase, styles.rightButton]} onPress={()=>{
          changeImage("next")
        }}>
          <ArrowLeft color="white" width={RFValue(15)} height={RFValue(15)} />
        </TouchableOpacity>

        <View style={styles.infoArea}>
          <CustomTextBold style={styles.h1}>
            {sequenceName ? maxCharacterHandler(sequenceName, 30) : "No Address"}
          </CustomTextBold>
          <CustomText style={styles.h2}>
            {dateConvert(captureDate, "MMM DD, YYYY - HH:mm")}
          </CustomText>
          <LogoWatermark width={70} height={21} />
        </View>
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
  gradientBackgroundTop: {
    position: "absolute",
    left: 0,
    right: 0,
    top:0,
    height: "20%",
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

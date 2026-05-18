import {useNavigation} from "@react-navigation/native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import React, {useEffect} from "react";
import {RFValue} from "react-native-responsive-fontsize";
import {TouchableOpacity, View} from "react-native";
import Lottie from "lottie-react-native";
import {CustomText, CustomTextBold} from "../highordercomponents";
import {UploadCompletedSvg} from "../assets/svg/illustrations";
import {useTranslation} from "react-i18next";
import FocusAwareStatusBar from "../components/FocusAwareStatusBar";

const UploadCompleted = () => {
  const navigation = useNavigation();
  const {bottom} = useSafeAreaInsets();
  const {t} = useTranslation("upload_complete");

  useEffect(() => {
    navigation.getParent().setOptions({tabBarStyle: {display: "none"}})
    return () => navigation.getParent().setOptions({tabBarStyle: {display: "flex", height: RFValue(63) + bottom}})
  }, [bottom, navigation]);

  return (
    <View style={{flex: 1,backgroundColor:"#fff"}}>
      <FocusAwareStatusBar barStyle="dark-content" translucent backgroundColor="#fff" />
      <View style={{
        alignItems: "center",
        marginBottom: "auto",
        marginHorizontal: RFValue(40),
      }}>
        <View style={{alignItems: "center"}}>
          <View style={{zIndex: 1}}>
            <Lottie
              source={require('../assets/animations/completed.json')}
              style={{height: RFValue(375), paddingTop: RFValue(25)}}
              autoPlay={true}
              loop={true}
            />
          </View>
          <View style={{position: "absolute", bottom: RFValue(25), zIndex: 2}}>
            <UploadCompletedSvg height={RFValue(75)} width={RFValue(75)}/>
          </View>
        </View>

        <View style={{alignItems: "center"}}>
          <CustomTextBold style={{fontSize: RFValue(14), color:"#191919"}}>
            {t("title")}
          </CustomTextBold>
          <CustomText style={{textAlign: "center", marginTop: RFValue(10), color:"#808080"}}>
            {t("description")}
          </CustomText>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => navigation.reset({index: 0, routes: [{name: "MapTab"}]})}
        style={{
          borderWidth: RFValue(1),
          borderColor: "#3F8BE9",
          borderRadius: RFValue(24),
          marginHorizontal: RFValue(40),
          alignItems: "center",
          marginBottom: RFValue(47),
          paddingVertical: RFValue(13),
          zIndex: 10,
        }}
      >
        <CustomText style={{
          color: "#3F8BE9",
          fontSize: RFValue(16)
        }}>
          {t("go_to_map")}
        </CustomText>
      </TouchableOpacity>
    </View>
  )
}

export default UploadCompleted;

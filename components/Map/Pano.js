import React, { useState } from "react";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Dimensions,
  ScrollView,
} from "react-native";
import { panoStyle } from "../../styles/panoStyle";
import ReportIcon from "../../assets/svg/illustrations/ReportIcon";
import LogoWatermark from "../../assets/svg/illustrations/LogoWatermark";
import SwitchMapPano from "../../assets/svg/illustrations/SwitchMapPano";
import MinimizePano from "../../assets/svg/illustrations/MinimizePano";
import Campus from "../../assets/svg/illustrations/Campus";
import moment from "moment";
import { Routes } from "../../navigator/Routes";
import { fetchHandler } from "../../helper/helper";
import { useSelector } from "react-redux";
import { RFValue } from "react-native-responsive-fontsize";
import { NorthArrow } from "../../assets/svg/illustrations";
import { SERVICE_URL } from "@env";
import {errorToastMessage, infoToastMessage} from "../../helper/alerts";

const Pano = (props) => {
  const { imageInformation, navigation } = props;
  const { auth } = useSelector((state) => state.getTokenReducer);
  const [fullHeight, setFullHeight] = useState(false);

  const reportImage = () => {
    if (auth) {
      fetchHandler({
        url: `${SERVICE_URL}/api/function/image_complaint/complaint/report`,
        method: "POST",
        data: {
          options: {
            parameters: {
              imagery_id: imageInformation.pointID,
              message: "",
            },
          },
        },
      }).then((res) => {
        infoToastMessage("Your report has been sent successfully. Necessary investigations will be made and you will be informed by e-mail.")
      }).catch(() => {
        errorToastMessage("An error occurred while reporting. Try again.")
      });
    } else {
      navigation.navigate(Routes.login);
    }
  };

  return (
    <View>
      <View style={panoStyle.topBar}>
        <TouchableOpacity
          style={panoStyle.switch}
          onPress={() => setFullHeight(!fullHeight)}
        >
          <SwitchMapPano />
        </TouchableOpacity>
        <View style={panoStyle.frameWrapper}>
          {/* <View style={panoStyle.playWrapper}>
            <View style={{ marginRight: RFValue(9.5) }}>
              <PlayArrowLeft />
            </View>
            <View>
              <PanoPlayBtn />
            </View>
            <View style={{ marginLeft: RFValue(9.5) }}>
              <PlayArrowRight />
            </View>
          </View> */}
          {/* <Text style={panoStyle.frameText}>
            (frame 120/{" "}
            <Text style={{ fontFamily: "Poppins-SemiBold" }}>45</Text>)
          </Text> */}
        </View>

        <TouchableOpacity style={panoStyle.minimize} onPress={props.hidePano}>
          <MinimizePano />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal={true}>
        <ScrollView>
          <Image
            source={{
              uri: fullHeight
                ? imageInformation.highResImage
                : imageInformation.image,
            }}
            style={{
              height: fullHeight
                ? RFValue(592)
                : Dimensions.get("window").height > 1100
                ? RFValue(285)
                : RFValue(345),
              width: RFValue(Dimensions.get("window").width),
              resizeMode: "cover",
              aspectRatio: 3 / 2,
            }}
          />
        </ScrollView>
      </ScrollView>
      <View style={panoStyle.watermark}>
        <LogoWatermark />
      </View>

      <View style={panoStyle.userActionWrapper}>
        {/* <View style={panoStyle.zoomWrapper}>
          <View style={panoStyle.zoomIn}>
            <ZoomIn />
          </View>
          <View style={panoStyle.zoomOut}>
            <ZoomOut />
          </View>
        </View> */}
        <View>
          <NorthArrow />
        </View>
        <View
          style={{
            transform: [{ rotate: `${imageInformation.heading}deg` }],
          }}
        >
          <Campus />
        </View>
      </View>

      <View style={panoStyle.bottomTab}>
        <Pressable style={panoStyle.report} onPress={reportImage}>
          <ReportIcon />
          <Text style={panoStyle.reportText}>Image Report</Text>
        </Pressable>

        <View style={panoStyle.capturerWrapper}>
          {/* <Text style={panoStyle.capturerName}>@M.CanVarer</Text> */}
          <Text style={panoStyle.captureDate}>
            {moment(imageInformation.date).format("DD.MM.YYYY")}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Pano;

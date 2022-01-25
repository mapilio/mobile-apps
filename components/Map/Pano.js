import React from "react";
import { Image, View, Text, TouchableOpacity } from "react-native";
import { panoStyle } from "../../styles/panoStyle";
import ReportIcon from "../../assets/svg/illustrations/ReportIcon";
import LogoWatermark from "../../assets/svg/illustrations/LogoWatermark";
import SwitchMapPano from "../../assets/svg/illustrations/SwitchMapPano";
import PlayArrowLeft from "../../assets/svg/illustrations/PlayArrowLeft";
import PanoPlayBtn from "../../assets/svg/illustrations/PanoPlayBtn";
import PlayArrowRight from "../../assets/svg/illustrations/PlayArrowRight";
import MinimizePano from "../../assets/svg/illustrations/MinimizePano";
import { RFValue } from "react-native-responsive-fontsize";
import ZoomIn from "../../assets/svg/illustrations/ZoomIn";
import ZoomOut from "../../assets/svg/illustrations/ZoomOut";
import Campus from "../../assets/svg/illustrations/Campus";
import moment from "moment";

const Pano = (props) => {
  const { imageInformation } = props;

  return (
    <View>
      <View style={panoStyle.topBar}>
        <TouchableOpacity style={panoStyle.switch} onPress={props.hidePano}>
          <SwitchMapPano />
        </TouchableOpacity>
        <View style={panoStyle.frameWrapper}>
          <View style={panoStyle.playWrapper}>
            <View style={{ marginRight: RFValue(9.5) }}>
              <PlayArrowLeft />
            </View>
            <View>
              <PanoPlayBtn />
            </View>
            <View style={{ marginLeft: RFValue(9.5) }}>
              <PlayArrowRight />
            </View>
          </View>
          <Text style={panoStyle.frameText}>
            (frame 120/{" "}
            <Text style={{ fontFamily: "Poppins-SemiBold" }}>45</Text>)
          </Text>
        </View>

        <TouchableOpacity
          style={panoStyle.minimize}
          onPress={props.minimizePano}
        >
          <MinimizePano />
        </TouchableOpacity>
      </View>

      <Image
        source={{ uri: imageInformation.image }}
        style={panoStyle.imageStyle}
      />

      <View style={panoStyle.watermark}>
        <LogoWatermark />
      </View>

      <View style={panoStyle.userActionWrapper}>
        <View style={panoStyle.zoomWrapper}>
          <View style={panoStyle.zoomIn}>
            <ZoomIn />
          </View>
          <View style={panoStyle.zoomOut}>
            <ZoomOut />
          </View>
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
        <View style={panoStyle.report}>
          <ReportIcon />
          <Text style={panoStyle.reportText}>Image Report</Text>
        </View>

        <View style={panoStyle.capturerWrapper}>
          <Text style={panoStyle.capturerName}>@M.CanVarer</Text>
          <Text style={panoStyle.captureDate}>
            {moment(imageInformation.date).format("DD.MM.YYYY")}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Pano;

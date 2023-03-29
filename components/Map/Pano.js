import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { panoStyle } from "../../styles/panoStyle";
import ReportIcon from "../../assets/svg/illustrations/ReportIcon";
import LogoWatermark from "../../assets/svg/illustrations/LogoWatermark";
import SwitchMapPano from "../../assets/svg/illustrations/SwitchMapPano";
import Campus from "../../assets/svg/illustrations/Campus";
import { RFValue } from "react-native-responsive-fontsize";
import { MaximizePano, MinimizePano } from "../../assets/svg/illustrations";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Panorama from "../Panorama";
import { useTranslation } from "react-i18next";
import LinearGradient from "react-native-linear-gradient";
import { tabHeight } from "../../util/consts/ui";
import { useActionSheet } from "@expo/react-native-action-sheet";
import {api} from "../../util/helpers/api";
import { dateConvert } from "../../helper/helper";

const Pano = ({ imageInformation, hidePano }) => {
  const [fullHeight, setFullHeight] = useState(false);
  const [username, setUsername] = useState(null);
  const { top, bottom } = useSafeAreaInsets();
  const { height } = Dimensions.get("screen");

  const { showActionSheetWithOptions } = useActionSheet();
  const { t } = useTranslation("report", { nsMode: "fallback" });

  useEffect(() => {
    api.get(`/api/search-user?options[parameters][id]=${imageInformation.user}`).then((res) => {
      if (res && Object.keys(res.data).length > 0 ) {
        let name = res.data[0].username;
        name.length > 20 ? (name = name.slice(0, 20) + "...") : name;

        setUsername("@" + name);
      } else {
        setUsername(null);
      }
    }).catch((err) => {
      setUsername(null);
      toast.show(err, {type: "error"});
    });
  }, [imageInformation]);


  const imageHeight = () => {
    const _imageHeight = height - tabHeight - bottom;

    return fullHeight ? _imageHeight : (_imageHeight + top) / 2;
  };

  const report = (reason) => {
    api.post('/api/image-report', {
      options: {
        parameters: {
          imagery_id: imageInformation.pointID,
          message: reason,
        },
      },
    }).then(() => {
      toast.show(t("report_success"), {type: "info"});
    }).catch(() => {
      toast.show(t("report_error"), {type: "error"});
    });
  };
  const reportImage = () => {
    showActionSheetWithOptions(
      {
        options: [
          t("cancel"),
          t("privacy_violation"),
          t("inappropriate_content"),
          t("low_quality"),
          t("other"),
        ],
        cancelButtonIndex: 0,
        useModal: true,
        showSeparators: true,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 1:
            report("Privacy Violation");
            break;
          case 2:
            report("Inappropriate Content");
            break;
          case 3:
            report("Low Quality");
            break;
          case 4:
            report("Other")
            break;
          default:
            break;
        }
      }
    );
  };

  return (
    <View style={{ zIndex: 10 }}>
      <View style={panoStyle.topBar}>
        <TouchableOpacity
          style={{ ...panoStyle.switch, top: top }}
          onPress={() => setFullHeight(!fullHeight)}
        >
          {fullHeight ? <MinimizePano /> : <MaximizePano />}
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...panoStyle.minimize, top: top }}
          onPress={hidePano}
        >
          <SwitchMapPano />
        </TouchableOpacity>
      </View>

      <Panorama
        image={imageInformation.highResImage}
        height={imageHeight()}
        resolution={imageInformation.resolution}
      />

      <View style={panoStyle.info}>
       <View style={panoStyle.capturer}>
       <Text style={panoStyle.capturer.name}>{username}</Text>
        <Text style={panoStyle.capturer.date}>
          {dateConvert(imageInformation.date,"MMM DD, YYYY - HH:mm")}
        </Text>
       </View>
        <View
          style={{ transform: [{ rotate: `${imageInformation.heading}deg` }], position:"absolute", right:RFValue(10), bottom:0 }}
        >
          <Campus />
        </View>
      </View>

      <LinearGradient
        colors={["#11111100", "#111111"]}
        angle={180}
        style={panoStyle.bottomTab}
      >
        <View style={panoStyle.watermark}>
          <LogoWatermark />
        </View>
        <TouchableOpacity style={panoStyle.report} onPress={reportImage}>
          <ReportIcon />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

export default Pano;

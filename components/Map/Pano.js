import React, {useEffect, useState} from "react";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Dimensions,
} from "react-native";
import { panoStyle } from "../../styles/panoStyle";
import ReportIcon from "../../assets/svg/illustrations/ReportIcon";
import LogoWatermark from "../../assets/svg/illustrations/LogoWatermark";
import SwitchMapPano from "../../assets/svg/illustrations/SwitchMapPano";
import MinimizePano from "../../assets/svg/illustrations/MinimizePano";
import Campus from "../../assets/svg/illustrations/Campus";
import moment from "moment";
import {fetchHandler} from "../../helper/helper";
import {RFValue} from "react-native-responsive-fontsize";
import {NorthArrow} from "../../assets/svg/illustrations";
import Config from "react-native-config";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const Pano = ({imageInformation, hidePano}) => {
  const [fullHeight, setFullHeight] = useState(false);
  const [username, setUsername] = useState(null);
  const {top, bottom} = useSafeAreaInsets();
  const {height} = Dimensions.get("screen")

  useEffect(() => {
    fetchHandler({
      url: `${Config.SERVICE_URL}/api/search-user?options[parameters][id]=${imageInformation.user}`
    }).then(({data}) => {
      if (data && data.length) {
        setUsername('@' + data[0].username)
      } else {
        setUsername(null)
      }
    }).catch((err) => {
      setUsername(null)
      toast.show(err.response.data.message, {type: "error"})
    })
  }, [])

  const imageHeight = () => {
    const _imageHeight = height - RFValue(63) - bottom

    return fullHeight ? _imageHeight : (_imageHeight + top) / 2
  }


  const reportImage = () => {
    fetchHandler({
      url: `${Config.SERVICE_URL}/api/function/image_complaint/complaint/report`,
      method: "POST",
      data: {
        options: {
          parameters: {
            imagery_id: imageInformation.pointID,
            message: "",
          },
        },
      },
    }).then(() => {
      toast.show('Your report has been sent successfully. Necessary investigations will be made and you will be informed by e-mail.', {type: 'info'})
    }).catch(() => {
      toast.show('An error occurred while reporting. Try again.', {type: 'error'})
    });
  };

  return (
    <View>
      <View style={panoStyle.topBar}>
        <TouchableOpacity style={{...panoStyle.switch, top: top}} onPress={() => setFullHeight(!fullHeight)}>
          <SwitchMapPano/>
        </TouchableOpacity>
        <TouchableOpacity style={{...panoStyle.minimize, top: top}} onPress={hidePano}>
          <MinimizePano/>
        </TouchableOpacity>
      </View>
      <Image
        source={{uri: imageInformation.highResImage}}
        style={{
          height: imageHeight(),
          resizeMode: "cover",
          transform: [{translateY: -top}]
        }}
      />
      <View style={panoStyle.watermark}>
        <LogoWatermark />
      </View>

      <View style={panoStyle.userActionWrapper}>
        <View>
          <NorthArrow />
        </View>
        <View style={{transform: [{rotate: `${imageInformation.heading}deg`}]}}>
          <Campus />
        </View>
      </View>

      <View style={panoStyle.bottomTab}>
        <Pressable style={panoStyle.report} onPress={reportImage}>
          <ReportIcon />
          <Text style={panoStyle.reportText}>Image Report</Text>
        </Pressable>

        <View style={panoStyle.capturerWrapper}>
          <Text style={panoStyle.capturerName}>{username}</Text>
          <Text style={panoStyle.captureDate}>
            {moment(imageInformation.date).format("DD.MM.YYYY")}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Pano;

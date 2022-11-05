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
import {Routes} from "../../navigator/Routes";
import {fetchHandler} from "../../helper/helper";
import {useSelector} from "react-redux";
import {RFValue} from "react-native-responsive-fontsize";
import {NorthArrow} from "../../assets/svg/illustrations";
import {toastMessage} from "../../helper/alerts";
import Config from "react-native-config";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const Pano = (props) => {
  const {imageInformation, navigation} = props;
  const {auth} = useSelector((state) => state.getTokenReducer);
  const [fullHeight, setFullHeight] = useState(false);
  const {top, bottom} = useSafeAreaInsets();
  const {height} = Dimensions.get("screen")

  const imageHeight = () => {
    if (fullHeight) {
      return height - RFValue(63 + bottom + top)
    }

    return (height - RFValue(63 + bottom + top)) / 2
  }

  const reportImage = () => {
    if (auth) {
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
        toastMessage.info("Your report has been sent successfully. Necessary investigations will be made and you will be informed by e-mail.")
      }).catch(() => {
        toastMessage.error("An error occurred while reporting. Try again.")
      });
    } else {
      navigation.reset({index: 0, routes: [{name: Routes.login}]})
    }
  };

  return (
    <View>
      <View style={panoStyle.topBar}>
        <TouchableOpacity style={panoStyle.switch} onPress={() => setFullHeight(!fullHeight)}>
          <SwitchMapPano />
        </TouchableOpacity>

        <TouchableOpacity style={panoStyle.minimize} onPress={props.hidePano}>
          <MinimizePano />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal={true}>
        <ScrollView>
          <Image
            source={{uri: imageInformation.highResImage}}
            style={{
              height: imageHeight(),
              aspectRatio: 21/9,
            }}
          />
        </ScrollView>
      </ScrollView>
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
          <Text style={panoStyle.captureDate}>
            {moment(imageInformation.date).format("DD.MM.YYYY")}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Pano;

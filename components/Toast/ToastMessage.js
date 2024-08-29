import { useEffect } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {ActivityIndicator} from "react-native-paper";
import {
  CloseIcon,
  ErrorIcon,
  Icon,
  SuccessIcon,
  WarningIcon,
} from "../../assets/svg/illustrations";
import { vibrate } from "../../util/helpers";
import SuccessBlackIcon from '../../assets/svg/illustrations/SuccessBlackIcon';

const ToastMessage = ({ options: { id, type, message, hideToast } }) => {

  const { top } = useSafeAreaInsets();
  const icons = {
    success: <SuccessIcon />,
    error: <ErrorIcon />,
    warning: <WarningIcon />,
    info: <Icon />,
    loading: <ActivityIndicator size={"small"} color="white" />,
    white: <SuccessBlackIcon />,
  };

  const handleClose = () => {
    if(hideToast){
      hideToast();
    }else{
      toast.hide(id);
    }
  }

  useEffect(() => {
    vibrate(type);
  }, []);

  return (
    <View style={{ ...styles.wrapper, ...styles[type + "Bg"], marginTop:top}}>
        <View style={styles.statusIcon}>{icons[type]}</View>
        <Text style={styles.text(type)}>{message}</Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeIcon}>
          <CloseIcon color={"#D8D8D8"} />
        </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    width: Dimensions.get("window").width - RFValue(26),
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(8),
    borderRadius: RFValue(24),
    minHeight: RFValue(50),
    flexDirection: "row",
    alignItems: "center",
  },
  closeIcon: {
    position: "absolute",
    right: RFValue(10),
    height: "100%",
    justifyContent: "center",
  },
  text: (type)=> ({
    marginHorizontal: RFValue(30),
    marginVertical: RFValue(5),
    fontFamily: "Poppins",
    color: type === 'white' ? '#000' : "#FFFFFF",
    paddingLeft: RFValue(10),
    lineHeight: RFValue(16),
    fontSize: RFValue(12),
  }),
  statusIcon: {
    position: "absolute",
    left: RFValue(10),
    height: "100%",
    justifyContent: "center",
  },
  successBg: {
    backgroundColor: "#38B35A",
  },
  warningBg: {
    backgroundColor: "#FBA63C",
  },
  infoBg: {
    backgroundColor: "#4A90E2",
  },
  errorBg: {
    backgroundColor: "#EC4E2C",
  },
  loadingBg: {
    backgroundColor: "#191919",
  },
  whiteBg: {
    backgroundColor: "#FFFFFF",
  },
});

export default ToastMessage;

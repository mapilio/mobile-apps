import {Dimensions, Pressable, StyleSheet, Text, View} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {CloseIcon, ErrorIcon, Icon, SuccessIcon, WarningIcon} from "../assets/svg/illustrations";

const ToastMessage = ({options: {id, type, message}}) => {
  const {bottom} = useSafeAreaInsets();

  const icons = {
    success: <SuccessIcon/>,
    error: <ErrorIcon/>,
    warning: <WarningIcon/>,
    info: <Icon/>
  }

  const handleClose = () => toast.hide(id)

  return (
    <View style={{...styles.wrapper, ...styles[type + 'Bg'], marginBottom: bottom}}>
      <View>
        <View style={styles.statusIcon}>{icons[type]}</View>
        <Text style={{...styles[type + 'Text'], ...styles.text}}>{message}</Text>
      </View>
      <Pressable onPress={handleClose} style={styles.closeIcon}>
        <CloseIcon color={'#D8D8D8'}/>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: Dimensions.get("window").width - RFValue(26),
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(8),
    borderRadius: RFValue(24),
    borderWidth: .5,
    position: "relative",
    minHeight: RFValue(50),
  },
  closeIcon: {
    position: "absolute",
    right: 0,
    top: RFValue(12),
    width: RFValue(40),
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    marginHorizontal: RFValue(30),
    marginVertical: RFValue(5),
  },
  statusIcon: {
    position: "absolute",
    left: 0,
    top:0,
    alignItems: "center",
    justifyContent: "center"

  },
  successBg: {
    backgroundColor: '#F4F2F6',
    borderColor: '#38B35A'
  },
  successText: {
    color: "#000"
  },
  warningBg: {
    backgroundColor: '#F4F2F6',
    borderColor: '#FBA63C'
  },
  warningText: {
    color: "#000"
  },
  infoBg: {
    backgroundColor: '#F4F2F6',
    borderColor: '#4A90E2'
  },
  infoText: {
    color: "#000"
  },
  errorBg: {
    backgroundColor: '#FAECEC',
    borderColor: '#EC4E2C'
  },
  errorText: {
    color: "#EC4E2C"
  },
})

export default ToastMessage;

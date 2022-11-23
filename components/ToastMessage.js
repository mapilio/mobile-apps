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
      <View style={{...styles.messageInfo}}>
        {icons[type]}
        <Text style={styles[type + 'Text']}>{'\u00A0'} {message}</Text>
      </View>
      <Pressable onPress={handleClose}>
        <CloseIcon color={'#D8D8D8'}/>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: Dimensions.get("screen").width - RFValue(26),
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(8),
    borderRadius: RFValue(24),
    borderWidth: .5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  messageInfo: {
    flexDirection: "row",
    alignItems: "center",
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

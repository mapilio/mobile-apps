import { View, Modal, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { CustomText, CustomTextMedium } from "../../highordercomponents"
import AnimatedLottieView from "lottie-react-native";
import { CloseIcon } from "../../assets/svg/illustrations";
import { useTranslation } from "react-i18next";

const NewsletterModal = ({
  visible = false,
  setVisible
}) => {
  const {t} = useTranslation("login")
  

  return (
    <Modal
      visible={visible}
      statusBarTranslucent
      transparent
      animationType="fade"
    >
      <View style={styles.container} >
        <View style={styles.wrapper}>
        <TouchableOpacity 
        style={styles.closeButton} onPress={()=>{
          setVisible(false)
        }}>
      <CloseIcon color="white" />
        </TouchableOpacity>
          <View style={styles.profileIcon}>
          <AnimatedLottieView 
            style={{height:"100%", alignSelf:"center", transform:[{scale:1.2}]}}
          source={require("../../assets/animations/mailSubs.json")} autoPlay loop />
          </View>
          <CustomTextMedium style={styles.title}>{t("mail_request_title")}</CustomTextMedium>
          <CustomText style={styles.description}>
        {t("mail_request_desc")}
          </CustomText>
          <TextInput style={styles.input} placeholder="Enter your mail" />
          <TouchableOpacity style={styles.buttonApply} onPress={()=>{}}>
            <CustomText style={styles.buttonText}>Verify</CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  wrapper: {
    backgroundColor: "white",
    width: "90%",
    height: "45%",
    borderRadius: 20,
    marginBottom: RFValue(60),
    justifyContent: "center",
    alignItems: "center",
    padding: RFValue(10),
    paddingTop: RFValue(20),
  },
  closeButton:{
    position:"absolute",
    right:RFValue(10),
    top:RFValue(10),
    width:RFValue(25),
    height:RFValue(25),
    backgroundColor:"#d8d8d8",
    justifyContent:"center",
    alignItems:"center",
    borderRadius:RFValue(25),
  },
  profileIcon: {
    width:"100%",
    height: RFValue(77),
  },
  title: {
    fontSize: RFValue(14),
    color: "#191919",
    marginTop: RFValue(10),
  },
  description: {
    color: "#808080",
    fontSize: RFValue(12),
    marginTop: RFValue(10),
    textAlign: "center",
  },
  input: {
    backgroundColor: "#ECECEC",
    borderRadius: RFValue(24),
    height: RFValue(46),
    paddingHorizontal: RFValue(21),
    fontSize: RFValue(10),
    fontFamily: "Poppins-Light",
    width: "80%",
    height: RFValue(40),
    marginTop: RFValue(10),
  },
  buttonApply: {
    marginTop: RFValue(10),
    width: "80%",
    height: RFValue(40),
    borderRadius: RFValue(50),
    justifyContent: "center",
    backgroundColor: "#0056F1",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: RFValue(13),
  },
  infoText: {
    fontSize: RFValue(8),
    color: "#808080",
    marginTop: 20,
    textAlign: "center",
  },
});
export default NewsletterModal;

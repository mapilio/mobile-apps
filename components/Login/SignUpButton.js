import {CustomText} from "../../highordercomponents";
import {StyleSheet, TouchableOpacity} from "react-native";
import {Routes} from "../../navigator/Routes";
import {RFValue} from "react-native-responsive-fontsize";
import {useTranslation} from "react-i18next";

const SignUpButton = ({navigation}) => {
  const {t} = useTranslation("navigation");

  return (
    <TouchableOpacity onPress={() => navigation.navigate(Routes.register)}>
      <CustomText style={styles.text}>
        {t("sign_up")}
      </CustomText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  text: {
    color: '#D8D8D8',
    marginRight: RFValue(28),
    fontSize: RFValue(14.5),
    marginTop: RFValue(10)
  }
})

export default SignUpButton;

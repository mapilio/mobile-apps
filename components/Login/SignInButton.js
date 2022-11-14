import {CustomText} from "../../highordercomponents";
import {StyleSheet, TouchableOpacity} from "react-native";
import {Routes} from "../../navigator/Routes";
import {RFValue} from "react-native-responsive-fontsize";

const SignUpButton = ({navigation}) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate(Routes.login)}>
      <CustomText style={styles.text}>Sign in</CustomText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  text: {
    color: '#D8D8D8',
    marginRight: RFValue(28),
    fontSize: RFValue(16)
  }
})

export default SignUpButton;

import {StyleSheet, TouchableOpacity} from "react-native";
import {ArrowLeft} from "../../assets/svg/illustrations";
import {RFValue} from "react-native-responsive-fontsize";
import {useNavigation} from "@react-navigation/native";

const Back = ({route}) => {
  const navigation = useNavigation();

  const handleBack = () => {
    route?.params?.backRoute ? navigation.navigate(route.params.backRoute) : navigation.goBack()
  }

  return (
    <TouchableOpacity
      style={styles.backButton}
      onPress={handleBack}
    >
      <ArrowLeft width={RFValue(16)} height={RFValue(16)} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    backButton: {
    backgroundColor: "#ECECEC",
    borderRadius: RFValue(20),
    width: RFValue(34),
    height: RFValue(34),
    alignItems: "center",
    justifyContent: "center",
    marginLeft: RFValue(28),
    marginTop: RFValue(10)
  },
});

export default Back;

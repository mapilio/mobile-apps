import {StyleSheet, TouchableOpacity} from "react-native";
import {ArrowLeft} from "../../assets/svg/illustrations";
import {RFValue} from "react-native-responsive-fontsize";
import {useNavigation} from "@react-navigation/native";
import { Routes } from "../../navigator/Routes";

const Back = () => {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.navigate(Routes.map); 
  }

  return (
    <TouchableOpacity
      style={styles.backButton}
      onPress={handleBack}
    >
      <ArrowLeft color={"#FFFFFF"} width={RFValue(13)} height={RFValue(13)} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    backButton: {
    backgroundColor: "#FFFFFF4D",
    borderRadius: RFValue(20),
    width: RFValue(32),
    height: RFValue(32),
    alignItems: "center",
    justifyContent: "center",
    marginLeft: RFValue(28),
    paddingLeft: RFValue(3),
    marginTop: RFValue(10)
  },
});

export default Back;

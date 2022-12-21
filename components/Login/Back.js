import {StyleSheet, TouchableOpacity} from "react-native";
import {ArrowLeft} from "../../assets/svg/illustrations";
import {RFValue} from "react-native-responsive-fontsize";
import {useNavigation} from "@react-navigation/native";

const Back = ({route}) => {
  const navigation = useNavigation();

  const handleBack = () => {
    route.params?.backRoute ? navigation.navigate(route.params.backRoute) : navigation.goBack()
  }

  return (
    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
      <ArrowLeft color={'#FFFFFF'} width={RFValue(7)} height={RFValue(13)}/>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  backButton: {
    backgroundColor: '#FFFFFF4D',
    borderRadius: RFValue(20),
    width: RFValue(24),
    height: RFValue(24),
    alignItems: "center",
    justifyContent: "center",
    marginLeft: RFValue(28),
  }
})

export default Back;

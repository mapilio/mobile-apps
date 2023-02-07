import {Text, TouchableOpacity, View} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";

/**
 * Button Component
 * @param title - Button Title
 * @param containerStyle - Button Container Style
 * @param fontStyle - Button Text Style
 * @param onPress - Button On Press Function
 * @returns {JSX.Element} - Button Component JSX Element to be rendered
 */
export default ({title, containerStyle, fontStyle, onPress}) => {

  const styles = {
    container: {
      backgroundColor: '#3F8BE9',
      borderRadius: RFValue(24),
      paddingVertical: RFValue(13.5),
      alignItems: 'center',
      ...containerStyle,
    },
    text: {
      color: '#FFFFFF',
      fontFamily: 'Poppins',
      fontSize: RFValue(16),
      ...fontStyle,
    }
  }

  return (
    <View>
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <Text style={styles.text}>
          {title || 'Button'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

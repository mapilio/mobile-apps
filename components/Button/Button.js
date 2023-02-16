import {ActivityIndicator, Text, TouchableOpacity, View} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";

/**
 * Button Component
 * @param title - Button Title
 * @param containerStyle - Button Container Style
 * @param fontStyle - Button Text Style
 * @param onPress - Button On Press Function
 * @param disabled - Button Disabled State (Boolean) - Disables Button if true
 * @param loading - Button Loading State (Boolean) - Shows Activity Indicator if true
 *
 * @returns {JSX.Element} - Button Component JSX Element to be rendered
 *
 * @example
 * <Button
 *   title="Button"
 *   containerStyle={{backgroundColor: '#3F8BE9'}}
 *   fontStyle={{color: '#FFFFFF'}}
 *   onPress={() => console.log('Button Pressed')}
 *   disabled={false}
 *   loading={false}
 * />
 *
 */
export default ({title, containerStyle, fontStyle, onPress, disabled, loading}) => {

  const styles = {
    container: {
      backgroundColor: '#3F8BE9',
      borderRadius: RFValue(24),
      paddingVertical: RFValue(13.5),
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      ...containerStyle,
      opacity: disabled ? 0.5 : 1,
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
      <TouchableOpacity style={styles.container} onPress={onPress} disabled={disabled}>
        {loading && <ActivityIndicator color="#fff" size="small" />}
        <Text style={styles.text}>{title || 'Button'}</Text>
      </TouchableOpacity>
    </View>
  )
}

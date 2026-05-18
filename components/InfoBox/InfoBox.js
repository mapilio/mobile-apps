import { View, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from '../../highordercomponents/CustomText';
import { ErrorIcon, InfoFilled, SuccessIcon, WarningFilled } from '../../assets/svg/illustrations';

/**
 *
 * @param {string} type - success, error, warning, info
 * @param {string} content - content of the info box
 * @returns
 */
const InfoBox = ({ type, content }) => {
  const icons = {
    success: <SuccessIcon />,
    error: <ErrorIcon />,
    warning: <WarningFilled />,
    info: <InfoFilled />,
  };

  const colors = {
    success: '#3D9C5C',
    error: '#E6432A',
    warning: '#FBA63C1A',
    info: '#4A90E21A',
  };

  return (
    <View style={styles.base}>
      <View
        style={{
          ...styles.container,
          backgroundColor: colors[type],
        }}>
        <View style={{ paddingRight: RFValue(7) }}>{icons[type]}</View>
        <CustomText style={styles.text}>{content}</CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderRadius: RFValue(5),
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(10),
  },
  text: {
    flex: 1,
    fontSize: RFValue(11.5),
    color: '#191919',
  },
});

export default InfoBox;

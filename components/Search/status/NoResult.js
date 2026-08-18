import { Text, View, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { NoResultIcon } from '../../../assets/svg/illustrations';
import { useTranslation } from 'react-i18next';

const NoResult = () => {
  const { t } = useTranslation('search');
  return (
    <View style={styles.wrapper}>
      <NoResultIcon width={200} height={200} />
      <Text style={styles.title}>{t('no_results')}</Text>
      <Text style={styles.description}>{t('another_search')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: RFValue(40),
  },
  title: {
    fontFamily: 'Poppins-Medium',
    fontSize: RFValue(16),
    color: '#191919',
    marginTop: RFValue(10),
  },
  description: {
    fontFamily: 'Poppins',
    fontSize: RFValue(14),
    color: '#808080',
  },
});

export default NoResult;

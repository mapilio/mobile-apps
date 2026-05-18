import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../../navigator/Routes';
import styles from './FeedList.styles';
import { useTranslation } from 'react-i18next';

const EmptyComponent = () => {
  const navigation = useNavigation();
  const { t } = useTranslation('profile');

  return (
    <View style={styles.noFeedWrapper}>
      <Text style={styles.noFeedTitle}>{t('no_feed')}</Text>
      <Text style={styles.noFeedDescription}>{t('no_feed_desc')}</Text>
      <TouchableOpacity
        style={styles.noFeedButton}
        onPress={() => navigation.navigate(Routes.tabNavigator, { screen: Routes.cameraTab })}>
        <Text style={styles.noFeedButton.text}>{t('start_capture')}</Text>
      </TouchableOpacity>
    </View>
  );
};
export default EmptyComponent;

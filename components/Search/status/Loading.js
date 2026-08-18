import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const Loading = () => {
  return (
    <View style={styles.wrapper}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: RFValue(20),
  },
});

export default Loading;

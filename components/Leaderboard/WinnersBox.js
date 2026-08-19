import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { CustomTextBold, CustomText } from '../../highordercomponents';
import { RFValue } from 'react-native-responsive-fontsize';
import { maxCharacterHandler } from '../../helper/helper';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../../navigator/Routes';

const WinnersBox = ({ winners }) => {
  const { t } = useTranslation('leaderboard');
  const navigation = useNavigation();
  const Badge = ({ rankIndex }) => {
    const RankBadges = [
      require('../../assets/images/goldMedal.png'),
      require('../../assets/images/silverMedal.png'),
      require('../../assets/images/bronzeMedal.png'),
    ];

    return (
      <View style={styles.badge}>
        <Image
          source={RankBadges[rankIndex]}
          defaultSource={RankBadges[rankIndex]}
          resizeMode="cover"
        />
      </View>
    );
  };

  const orderedWinners = winners.map((winner, index) => {
    winner.rank = index;
    return winner;
  });

  orderedWinners[1] = orderedWinners.splice(0, 1, orderedWinners[1])[0];

  return (
    <View style={styles.base}>
      <CustomTextBold style={styles.header}>{t('winners_title')}</CustomTextBold>

      <View style={styles.row}>
        {orderedWinners.map((winner, index) => (
          <View
            key={index}
            style={{
              ...styles.column,
              marginBottom: index === 1 ? RFValue(50) : 0,
              marginHorizontal: index === 1 ? RFValue(20) : 0,
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(Routes.stackNavigator, {
                  screen: Routes.stackUserFeed,
                  params: {
                    userID: winner.id,
                  },
                });
              }}
              accessibilityRole="button"
              accessibilityLabel={`View ${winner.display_name}'s profile`}>
              <Image
                source={{ uri: winner.user_profile_photo }}
                style={styles.photo}
                resizeMethod="resize"
              />
              <Badge rankIndex={winner.rank} />
            </TouchableOpacity>
            <CustomText style={{ color: '#191919', fontSize: 14 }}>
              {maxCharacterHandler(winner.display_name, 10)}
            </CustomText>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: RFValue(10),
  },
  header: { color: '#191919', fontSize: 22, textAlign: 'center' },
  row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    paddingTop: RFValue(5),
  },
  column: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    backgroundColor: '#F5F5F6',
    width: RFValue(70),
    height: RFValue(70),
    borderRadius: RFValue(60),
    marginTop: 5,
    overflow: 'hidden',
  },
  badge: {
    width: RFValue(30),
    height: RFValue(30),
    borderRadius: RFValue(30),
    backgroundColor: '#F5F5F6',
    borderWidth: RFValue(2),
    borderColor: '#fff',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    right: -10,
    zIndex: 1,
  },
});

export default WinnersBox;

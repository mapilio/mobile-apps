import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from './Routes';
import { AuthNavigator, ProfileNavigator } from './partials';
import { Award, HowToScore, WelcomeWalkthrough } from '../screens';
import { UserFeedList, UserFeedDetails } from '../screens/UserFeed';
import { BackButton } from '../components';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const Stack = createStackNavigator();
const StackNavigator = ({ route }) => {
  const { t } = useTranslation('navigation');

  const options = {
    headerShown: true,
    title: null,
    headerStyle: styles.headerStyle,
    cardStyle: styles.cardStyle,
    headerLeft: (props) => <BackButton {...props} />,
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Routes.auth} component={AuthNavigator} initialParams={route.params} />
      <Stack.Screen name={Routes.profileNavigator} component={ProfileNavigator} />

      <Stack.Group
        screenOptions={{ presentation: 'modal', gestureEnabled: false, headerShown: false }}>
        <Stack.Screen name={Routes.welcomeWalkthrough} component={WelcomeWalkthrough} />
        <Stack.Screen name={Routes.howToScore} component={HowToScore} options={options} />
        <Stack.Screen name={Routes.award} component={Award} options={options} />
      </Stack.Group>

      <Stack.Group>
        <Stack.Screen
          name={Routes.stackUserFeed}
          component={UserFeedList}
          options={{
            headerShown: true,
            title: null,
            headerBackTitle: 'Map',
            headerTitleAlign: 'center',
            headerLeft: (props) => <BackButton {...props} />,
          }}
        />
        <Stack.Screen
          name={Routes.stackUserFeedDetail}
          component={UserFeedDetails}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#FFF',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  cardStyle: {
    backgroundColor: '#FFF',
  },
});

export default StackNavigator;

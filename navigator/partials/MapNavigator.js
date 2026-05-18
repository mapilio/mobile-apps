import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from '../Routes';
import { AppMap } from '../../screens';
import noInternetAccess from '../../screens/NoInternetAccess';
import { useSelector } from 'react-redux';

const Stack = createStackNavigator();

const MapNavigator = () => {
  const { welcomeWalkthroughStatus } = useSelector((state) => state.generalReducer);

  const mapListener = ({ navigation }) => ({
    focus: () => {
      !welcomeWalkthroughStatus &&
        navigation.navigate(Routes.stackNavigator, { screen: Routes.welcomeWalkthrough });
    },
  });

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Routes.map} component={AppMap} listeners={mapListener} />
      <Stack.Screen name={Routes.noInternetAccess} component={noInternetAccess} />
    </Stack.Navigator>
  );
};

export default MapNavigator;

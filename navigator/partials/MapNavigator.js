import { createStackNavigator } from "@react-navigation/stack";
import { Routes } from "../Routes";
import { AppMap } from "../../screens";
import noInternetAccess from "../../screens/NoInternetAccess";
import ProfileNavigator from "./ProfileNavigator";

const Stack = createStackNavigator();

const MapNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={Routes.map} component={AppMap} />
      <Stack.Screen name={"ProfileNavigator"} component={ProfileNavigator} />

      <Stack.Screen
        name={Routes.noInternetAccess}
        component={noInternetAccess}
      />
    </Stack.Navigator>
  );
};

export default MapNavigator;

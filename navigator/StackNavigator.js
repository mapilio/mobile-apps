import {createStackNavigator} from "@react-navigation/stack";
import {Routes} from "./Routes";
import {AuthNavigator, ProfileNavigator} from "./partials";
import {WelcomeWalkthrough} from "../screens";

const Stack = createStackNavigator();
const StackNavigator = ({route}) => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={Routes.auth} component={AuthNavigator} initialParams={route.params}/>
      <Stack.Screen name={Routes.profileNavigator} component={ProfileNavigator}/>

      <Stack.Group screenOptions={{presentation: "modal", gestureEnabled: false, headerShown: false }}>
        <Stack.Screen name={Routes.welcomeWalkthrough} component={WelcomeWalkthrough}/>
      </Stack.Group>
    </Stack.Navigator>
  )
}

export default StackNavigator;

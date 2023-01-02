import {createStackNavigator} from "@react-navigation/stack";
import {Routes} from "./Routes";
import {AuthNavigator, ProfileNavigator} from "./partials";

const Stack = createStackNavigator();
const StackNavigator = ({route}) => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={Routes.auth} component={AuthNavigator} initialParams={route.params}/>
      <Stack.Screen name={Routes.profileNavigator} component={ProfileNavigator}/>
    </Stack.Navigator>
  )
}

export default StackNavigator;

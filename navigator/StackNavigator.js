import {createStackNavigator} from "@react-navigation/stack";
import {Routes} from "./Routes";
import {AuthNavigator, ProfileNavigator} from "./partials";
import {HowToScore, WelcomeWalkthrough} from "../screens";
import {BackButton} from "../components";
import {StyleSheet} from "react-native";

const Stack = createStackNavigator();
const StackNavigator = ({route}) => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={Routes.auth} component={AuthNavigator} initialParams={route.params}/>
      <Stack.Screen name={Routes.profileNavigator} component={ProfileNavigator}/>

      <Stack.Group screenOptions={{presentation: "modal", gestureEnabled: false, headerShown: false }}>
        <Stack.Screen name={Routes.welcomeWalkthrough} component={WelcomeWalkthrough}/>

        <Stack.Screen name={Routes.howToScore} component={HowToScore} options={{
          headerShown: true,
          headerStyle: styles.headerStyle,
          cardStyle: styles.cardStyle,
          headerLeft: (props) => <BackButton {...props} />,
          title: false
        }}/>
      </Stack.Group>
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#FFF',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0
  },
  cardStyle: {
    backgroundColor: '#FFF'
  }
})

export default StackNavigator;

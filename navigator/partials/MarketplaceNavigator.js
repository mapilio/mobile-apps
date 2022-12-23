import {createStackNavigator} from "@react-navigation/stack";
import {Routes} from "../Routes";
import {Marketplace} from "../../screens";

const Stack = createStackNavigator()
const MarketplaceNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={Routes.marketplace} component={Marketplace}/>
    </Stack.Navigator>
  )
}

export default MarketplaceNavigator;

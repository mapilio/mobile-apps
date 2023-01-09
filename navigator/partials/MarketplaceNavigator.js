import {createStackNavigator} from "@react-navigation/stack";
import {Routes} from "../Routes";
import {Marketplace, MarketplaceReady} from "../../screens";

const Stack = createStackNavigator()
const MarketplaceNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={Routes.marketplace} component={Marketplace}/>
      <Stack.Screen name={Routes.marketplaceReady} component={MarketplaceReady}/>
    </Stack.Navigator>
  )
}

export default MarketplaceNavigator;

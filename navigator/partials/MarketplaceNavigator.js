import { createStackNavigator } from "@react-navigation/stack";
import { Routes } from "../Routes";
import {
  Marketplace,
  MarketplaceReady,
  MarketplaceSoon,
} from "../../screens/Marketplace";
import { Fragment } from "react";
import { useSelector } from "react-redux";

const Stack = createStackNavigator();
const MarketplaceNavigator = () => {
  const {config: {isMarketOpen}} = useSelector((state) => state.generalReducer);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isMarketOpen ? (
        <Fragment>
          <Stack.Screen name={Routes.marketplace} component={Marketplace} />
          <Stack.Screen
            name={Routes.marketplaceReady}
            component={MarketplaceReady}
          />
        </Fragment>
      ) : (
        <Stack.Screen
          name={Routes.marketplaceSoon}
          component={MarketplaceSoon}
        />
      )}
    </Stack.Navigator>
  );
};

export default MarketplaceNavigator;

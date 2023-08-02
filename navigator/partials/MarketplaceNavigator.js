import { createStackNavigator } from "@react-navigation/stack";
import { Routes } from "../Routes";
import {
  Marketplace,
  MarketplaceReady,
  MarketplaceSoon,
} from "../../screens/Marketplace";
import { Fragment, useEffect, useState } from "react";
import { api } from "../../util/helpers/api";

const Stack = createStackNavigator();
const MarketplaceNavigator = () => {
  const [isMarketplaceReady, setIsMarketplaceReady] = useState(false);

  useEffect(() => {
    checkMarketplaceReady();
  }, []);

  const checkMarketplaceReady = async () => {
    api
      .get("/general-config.json")
      .then((res) => {
        setIsMarketplaceReady(res.isMarketplace);
      })
      .catch(() => {
        setIsMarketplaceReady(false);
      });
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isMarketplaceReady ? (
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

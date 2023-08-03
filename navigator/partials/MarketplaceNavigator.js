import { createStackNavigator } from "@react-navigation/stack";
import { Routes } from "../Routes";
import {
  Marketplace,
  MarketplaceReady,
  MarketplaceSoon,
} from "../../screens/Marketplace";
import { Fragment, useEffect, useState } from "react";
import { api } from "../../util/helpers/api";
import Config from "react-native-config";

const Stack = createStackNavigator();
const MarketplaceNavigator = () => {
  const [isMarketplaceReady, setIsMarketplaceReady] = useState(false);

  useEffect(() => {
    checkMarketplaceReady();
  }, []);

  const checkMarketplaceReady = async () => {
    api
      .get("/config/general?token=" + Config.APP_CONFIG_TOKEN)
      .then((res) => {
        setIsMarketplaceReady(res.config.isMarketplace);
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

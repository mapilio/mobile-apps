import React, {useEffect} from "react";
import {NavigationContainer} from "@react-navigation/native";
import MainNavigator from "./navigator/MainNavigator";
import {persistor, store} from "./store/store";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import {NotifierWrapper} from "react-native-notifier";
import * as Sentry from "@sentry/react-native";
import Config from "react-native-config";
import {useFonts} from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
import {toastMessage} from "./helper/alerts";
import {permissionHandler} from "./helper/helper";
import {SafeAreaProvider} from "react-native-safe-area-context";

Sentry.init({dsn: `${Config.SENTRY_DSN}`, tracesSampleRate: 1.0});

function App() {
  const [fontsLoaded] = useFonts({
    "Poppins": require("./assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("./assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("./assets/fonts/Poppins-SemiBold.ttf"),
  });

  useEffect(() => {
    (async () => {
      await SplashScreen.preventAutoHideAsync();
    })()
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().then(async () => {
        await permissionHandler();
      }).catch((err) => toastMessage.error(`${err}`));
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <NotifierWrapper>
            <SafeAreaProvider>
              <MainNavigator/>
            </SafeAreaProvider>
          </NotifierWrapper>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

export default Sentry.wrap(App);

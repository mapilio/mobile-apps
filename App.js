import React, {useEffect} from "react";
import {NavigationContainer} from "@react-navigation/native";
import MainNavigator from "./navigator/MainNavigator";
import {persistor, store} from "./store/store";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import * as Sentry from "@sentry/react-native";
import Config from "react-native-config";
import {useFonts} from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
import {SafeAreaProvider} from "react-native-safe-area-context";
import Toast from "react-native-toast-notifications";
import {ToastMessage} from "./components";
import OneSignal from "react-native-onesignal";
import db from "./db";
import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import translations from "./translations";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

Sentry.init({
  dsn: `${Config.SENTRY_DSN}`,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});

OneSignal.setAppId(Config.ONESIGNAL_APP_ID);
OneSignal.promptForPushNotificationsWithUserResponse();
SplashScreen.preventAutoHideAsync();

function App() {
  const [fontsLoaded] = useFonts({
    "Poppins": require("./assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("./assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("./assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Light": require("./assets/fonts/Poppins-Light.ttf"),
  });

  const {generalReducer: {language}} = store.getState()

  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    resources: translations(),
    lng: language
  });

  useEffect(() => {
    db.startDB();
    db.addColumnIfNotExist('group_id');
    db.addColumnIfNotExist('address');
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <BottomSheetModalProvider>
              <ActionSheetProvider>
                <SafeAreaProvider>
                  <MainNavigator />
                  <Toast
                    ref={(ref) => (global["toast"] = ref)}
                    duration={3000}
                    renderToast={(options) => (
                      <ToastMessage options={options} />
                    )}
                    placement="top"
                    swipeEnabled={true}
                  />
                </SafeAreaProvider>
              </ActionSheetProvider>
            </BottomSheetModalProvider>
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(App);

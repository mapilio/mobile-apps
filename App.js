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
import {initialPermissions} from "./helper/helper";
import {SafeAreaProvider} from "react-native-safe-area-context";
import Toast from "react-native-toast-notifications";
import ToastMessage from "./components/ToastMessage";
import OneSignal from "react-native-onesignal";
import db from "./db";
import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import translations from "./translations";

Sentry.init({dsn: `${Config.SENTRY_DSN}`, tracesSampleRate: 1.0});

OneSignal.setAppId(Config.ONESIGNAL_APP_ID);
OneSignal.promptForPushNotificationsWithUserResponse();

function App() {
  const [fontsLoaded] = useFonts({
    "Poppins": require("./assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("./assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("./assets/fonts/Poppins-SemiBold.ttf"),
  });

  const {language} = store.getState().generalReducer

  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    resources: translations(),
    lng: language
  })

  useEffect(() => {
    db.startDB();

    (async () => {
      await SplashScreen.preventAutoHideAsync();
    })()
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().then(async () => {
        initialPermissions()
      }).catch((err) => toast.show(`${err}`, {type: "error"}));
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <SafeAreaProvider>
            <MainNavigator/>
            <Toast
              ref={(ref) => global['toast'] = ref}
              duration={3000}
              renderToast={(options) => <ToastMessage options={options}/>}
              placement="top"
            />
          </SafeAreaProvider>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

export default Sentry.wrap(App);

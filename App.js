import React, {useEffect} from "react";
import {NavigationContainer} from "@react-navigation/native";
import MainNavigator from "./navigator/MainNavigator";
import {Platform} from "react-native";
import {persistor, store} from "./store/store";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import {NotifierWrapper} from "react-native-notifier";
import * as Sentry from "@sentry/react-native";
import OneSignal from "react-native-onesignal";
import Config from "react-native-config";
import {useFonts} from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
import {toastMessage} from "./helper/alerts";
import {permissionHandler} from "./helper/helper";

if (Platform.OS === "ios") {
  OneSignal.setLogLevel(6, 0);
  OneSignal.setAppId("2620c665-4554-41ac-b180-593e0d75c328");
  if (Platform.OS === "ios") {
    OneSignal.promptForPushNotificationsWithUserResponse((response) => {
      // TODO SOMETHING
    });
  }
  //Method for handling notifications received while app in foreground
  OneSignal.setNotificationWillShowInForegroundHandler(
    (notificationReceivedEvent) => {
      // TODO SOMETHING
      let notification = notificationReceivedEvent.getNotification();
      const data = notification.additionalData;
      // Complete with null means don't show a notification.
      notificationReceivedEvent.complete(notification);
    }
  );
  //Method for handling notifications opened
  OneSignal.setNotificationOpenedHandler((notification) => {
    // TODO SOMETHING
  });
} else {
  OneSignal.setLogLevel(6, 0);
  OneSignal.setAppId("6e28fa17-37de-47a5-b6ab-20b69ec0aa3a");
  if (Platform.OS === "ios") {
    OneSignal.promptForPushNotificationsWithUserResponse((response) => {
      // TODO SOMETHING
    });
  }

  //Method for handling notifications received while app in foreground
  OneSignal.setNotificationWillShowInForegroundHandler(
    (notificationReceivedEvent) => {
      // TODO SOMETHING
      let notification = notificationReceivedEvent.getNotification();
      const data = notification.additionalData;
      // Complete with null means don't show a notification.
      notificationReceivedEvent.complete(notification);
    }
  );
  //Method for handling notifications opened
  OneSignal.setNotificationOpenedHandler((notification) => {
    // TODO SOMETHING
  });
}

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
            <MainNavigator/>
          </NotifierWrapper>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

export default Sentry.wrap(App);

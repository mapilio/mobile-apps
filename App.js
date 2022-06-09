import React, { useEffect, useState } from "react";
import AppLoading from "expo-app-loading";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./navigator/MainNavigator";
import { AppState, StatusBar, Dimensions, Platform } from "react-native";
import { persistor, store } from "./store/store";
import { Provider } from "react-redux";
import { permissionHandler, useFonts } from "./helper/helper";
import { PersistGate } from "redux-persist/integration/react";
import { NotifierWrapper } from "react-native-notifier";
import * as Sentry from "@sentry/react-native";
import OneSignal from "react-native-onesignal";

if (Platform.OS === "ios") {
  OneSignal.setLogLevel(6, 0);
  OneSignal.setAppId("2620c665-4554-41ac-b180-593e0d75c328");
  if(Platform.OS === "ios"){
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
  if(Platform.OS === "ios"){
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

Sentry.init({dsn: `${process.env.SENTRY_DSN_IOS}`, tracesSampleRate: 1.0});

function App() {
  const [isReady, setIsReady] = useState(false);

  const loadFonts = async () => {
    await useFonts();
  };

  useEffect(() => {
    if (isReady) {
      StatusBar.setBarStyle("light-content", true);
    }
  }, [isReady]);

  const setReady = async () => {
    await permissionHandler();
    openApp();
  };

  const openApp = () => setIsReady(true);

  if (!isReady) {
    return (
      <AppLoading
        startAsync={loadFonts}
        onFinish={setReady}
        onError={(error) => console.error(error)}
      />
    );
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <NotifierWrapper>
            <MainNavigator />
          </NotifierWrapper>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

export default Sentry.wrap(App);

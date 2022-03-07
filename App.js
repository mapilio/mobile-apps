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
  OneSignal.promptForPushNotificationsWithUserResponse((response) => {
    console.log("Prompt response:", response);
  });
  //Method for handling notifications received while app in foreground
  OneSignal.setNotificationWillShowInForegroundHandler(
    (notificationReceivedEvent) => {
      console.log(
        "OneSignal: notification will show in foreground:",
        notificationReceivedEvent
      );
      let notification = notificationReceivedEvent.getNotification();
      console.log("notification: ", notification);
      const data = notification.additionalData;
      console.log("additionalData: ", data);
      // Complete with null means don't show a notification.
      notificationReceivedEvent.complete(notification);
    }
  );
  //Method for handling notifications opened
  OneSignal.setNotificationOpenedHandler((notification) => {
    console.log("OneSignal: notification opened:", notification);
  });
}

if (Platform.OS === "ios") {
  Sentry.init({
    dsn: `${process.env.SENTRY_DSN_IOS}`,
    tracesSampleRate: 1.0,
  });
}

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

export default App;

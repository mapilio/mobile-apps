import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './navigator/MainNavigator';
import { persistor, store } from './store/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import * as Sentry from '@sentry/react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { toast as sonnerToast, Toaster } from 'sonner-native';
import { ToastMessage } from './components';

// Global toast shim — preserves the old toast.show(msg, {type}) API
// so the rest of the codebase does not need to change.
global.toast = {
  show: (message, options = {}) => {
    const { type = 'white', duration = 3000 } = options;
    const id = sonnerToast.custom(
      <ToastMessage options={{ type, message, hideToast: () => sonnerToast.dismiss() }} />,
      { duration }
    );
    return id;
  },
  hide: (id) => sonnerToast.dismiss(id),
  hideAll: () => sonnerToast.dismiss(),
};
import { LogLevel, OneSignal } from 'react-native-onesignal';
import db from './db';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translations from './translations';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import 'moment/locale/tr';
import 'moment/locale/ar';
import 'moment/locale/cs';
import 'moment/locale/da';
import 'moment/locale/el';
import 'moment/locale/es';
import 'moment/locale/fi';
import 'moment/locale/fr';
import 'moment/locale/it';
import 'moment/locale/pt';
import 'moment/locale/ro';
import 'moment/locale/ru';
import 'moment/locale/de';

if (!__DEV__) {
  Sentry.init({
    dsn: `${process.env.EXPO_PUBLIC_SENTRY_DSN}`,
    tracesSampleRate: 1.0,
    environment: process.env.EXPO_PUBLIC_NODE_ENV,
  });
}

const oneSignalAppId = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID;

if (oneSignalAppId) {
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  OneSignal.initialize(oneSignalAppId);

  if (!__DEV__) {
    OneSignal.Notifications.requestPermission(true);
  }
}
SplashScreen.preventAutoHideAsync();

const {
  generalReducer: { language },
} = store.getState();

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    resources: translations(),
    lng: language,
  });
}

function App() {
  const [fontsLoaded] = useFonts({
    Poppins: require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Light': require('./assets/fonts/Poppins-Light.ttf'),
  });

  useEffect(() => {
    db.startDB();
    db.addColumnIfNotExist('group_id');
    db.addColumnIfNotExist('address');
    db.addColumnIfNotExist('capture_id', 'INTEGER DEFAULT NULL');
    db.addColumnIfNotExist('default_storage_path', 'TEXT DEFAULT NULL');
    db.addColumnIfNotExist('capture_timestamp', 'INTEGER DEFAULT NULL');
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
                  <Toaster position="top-center" />
                </SafeAreaProvider>
              </ActionSheetProvider>
            </BottomSheetModalProvider>
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default __DEV__ ? App : Sentry.wrap(App);

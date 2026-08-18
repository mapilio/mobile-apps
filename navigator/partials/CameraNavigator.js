import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from '../Routes';
import { AppCamera, GeneralSettings, CaptureWalkthrough } from '../../screens';
import { navigatorStyle } from '../../styles/navigatorStyle';
import React from 'react';
import { GeneralSettingsNavigatorLeft } from './navigatorbars';
import { useTranslation } from 'react-i18next';
const Stack = createStackNavigator();

const CameraNavigator = () => {
  const { t } = useTranslation('camera_settings');

  const generalSettingsOptions = {
    headerLeft: (props) => <GeneralSettingsNavigatorLeft {...props} />,
    headerStyle: navigatorStyle.headerSettingsStyle,
    title: t('general_settings'),
    headerShown: true,
    headerTitleStyle: navigatorStyle.headerTitleStyle,
    presentation: 'modal',
    gestureEnabled: false,
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Routes.camera} component={AppCamera} />
      <Stack.Screen
        name={Routes.captureWalkthrough}
        component={CaptureWalkthrough}
        options={{
          presentation: 'modal',
        }}
      />

      <Stack.Screen
        name={Routes.generalSettings}
        component={GeneralSettings}
        options={generalSettingsOptions}
      />
    </Stack.Navigator>
  );
};

export default CameraNavigator;

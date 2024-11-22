import {createStackNavigator, TransitionPresets} from "@react-navigation/stack";
import {loginStyles} from "../../styles/loginStyles";
import {Back, SignInButton, SignUpButton} from "../../components/Login";
import {Routes} from "../Routes";
import {ForgotPassword, Login, Register} from "../../screens";
import React from "react";
import { useNavigation } from '@react-navigation/native';


const Stack = createStackNavigator();

const AuthNavigator = () => {
  const navigation = useNavigation()

  return (
    <Stack.Navigator
      id={"authNavigator"}
    >
      <Stack.Group
        screenOptions={{
          presentation: "card",
          headerStyle: loginStyles.headerStyle,
          title: false,
          headerLeft: () => (
            <Back navigation={navigation} />
          ),
        }}
      >
        <Stack.Screen
          name={Routes.login}
          component={Login}
          options={{headerRight: () => <SignUpButton/>}}
        />

        <Stack.Screen
          name={Routes.register}
          component={Register}
          options={{headerRight: () => <SignInButton/>}}
        />
        <Stack.Screen
          name={Routes.forgotPassword}
          component={ForgotPassword}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

export default AuthNavigator;

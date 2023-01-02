import {createStackNavigator} from "@react-navigation/stack";
import {loginStyles} from "../../styles/loginStyles";
import {Back, SignInButton, SignUpButton} from "../../components/Login";
import {Routes} from "../Routes";
import {ForgotPassword, Login, Register} from "../../screens";
import React from "react";

const Stack = createStackNavigator();

const AuthNavigator = ({navigation, route}) => {
  return (
    <Stack.Navigator>
      <Stack.Group screenOptions={{
        presentation: "card",
        headerStyle: loginStyles.headerStyle,
        title: false,
        headerLeft: ({onPress}) => <Back onPress={onPress} route={route.params}/>
      }}>
        <Stack.Screen
          name={Routes.login}
          component={Login}
          options={{headerRight: () => <SignUpButton navigation={navigation}/>}}
        />

        <Stack.Screen
          name={Routes.register}
          component={Register}
          options={{headerRight: () => <SignInButton navigation={navigation}/>}}
        />
        <Stack.Screen
          name={Routes.forgotPassword}
          component={ForgotPassword}
        />
      </Stack.Group>
    </Stack.Navigator>
  )
}

export default AuthNavigator;

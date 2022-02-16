import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as yup from "yup";
import { Formik } from "formik";
import { loginStyles } from "../styles/loginStyles";
import { Routes } from "../navigator/Routes";
import { CustomText } from "../highordercomponents";
import { globalStyles } from "../styles/globalStyles";
import { useDispatch } from "react-redux";
import { getTokenAction } from "../store/reducers/loginReducer/getTokenAction";
import { RFValue } from "react-native-responsive-fontsize";
import { Eye, EyeSlash } from "../assets/svg/illustrations";
import MapilioLogo from "../assets/svg/logos/MapilioLogo";
import { SocialLogin } from "../components";

const Login = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [securePassword, setSecurePassword] = useState(true);

  const login = async (values) => {
    await dispatch(getTokenAction(values, navigation.navigate));
  };

  const loginValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email("You have entered an invalid username and password")
      .required("Email Address is Required"),
    password: yup.string().required("Password is required"),
  });

  return (
    <View style={[globalStyles.container, loginStyles.container]}>
      <View>
        <View style={loginStyles.logo}>
          <MapilioLogo width={RFValue(150)} height={RFValue(50)} />
        </View>
        <View style={{ marginBottom: RFValue(30) }}>
          <CustomText style={loginStyles.headerText}>
            Login to manage your account
          </CustomText>
        </View>
        <ScrollView>
          <SocialLogin navigation={navigation} />
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validateOnBlur={false}
            validateOnChange={false}
            validationSchema={loginValidationSchema}
            onSubmit={(values) => login(values)}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              isValid,
            }) => (
              <>
                <View style={loginStyles.formGroup}>
                  <TextInput
                    name="email"
                    placeholder="Email or Username"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={
                      errors.email
                        ? { ...loginStyles.errorInput, ...loginStyles.input }
                        : loginStyles.input
                    }
                  />
                  {errors.email && (
                    <CustomText style={loginStyles.errorText}>
                      {errors.email}
                    </CustomText>
                  )}
                </View>
                <View style={loginStyles.formGroup}>
                  <CustomText
                    onPress={() => navigation.navigate(Routes.forgotPassword)}
                    style={{ ...loginStyles.link, textAlign: "right" }}
                  >
                    Forgot your password?
                  </CustomText>
                  <View style={{ justifyContent: "center" }}>
                    <TextInput
                      name="password"
                      placeholder="Password"
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                      style={
                        errors.password
                          ? { ...loginStyles.errorInput, ...loginStyles.input }
                          : loginStyles.input
                      }
                      secureTextEntry={securePassword}
                    />
                    <TouchableOpacity
                      style={loginStyles.passwordIcon}
                      onPress={() => setSecurePassword(!securePassword)}
                    >
                      {securePassword ? <Eye /> : <EyeSlash />}
                    </TouchableOpacity>
                  </View>
                  {errors.password && (
                    <CustomText style={loginStyles.errorText}>
                      {errors.password}
                    </CustomText>
                  )}
                </View>
                <CustomText style={loginStyles.smallText}>
                  Don't have an account yet?
                  <CustomText
                    style={{ ...loginStyles.link, fontSize: RFValue(14) }}
                    onPress={() => navigation.navigate(Routes.register)}
                  >
                    {" "}
                    Sign up here
                  </CustomText>
                </CustomText>
                <Pressable style={loginStyles.button} onPress={handleSubmit}>
                  <CustomText
                    style={{ ...loginStyles.secondaryText, color: "#fff" }}
                  >
                    Log In
                  </CustomText>
                </Pressable>
                <Pressable
                  onPress={() => {
                    navigation.navigate(Routes.nonUserTab);
                  }}
                >
                  <CustomText
                    style={{
                      fontSize: RFValue(14),
                      color: "#22CC69",
                      marginTop: RFValue(15),
                      textAlign: "center",
                    }}
                  >
                    Continue without a member
                  </CustomText>
                </Pressable>
              </>
            )}
          </Formik>
        </ScrollView>
      </View>
    </View>
  );
};
export default Login;

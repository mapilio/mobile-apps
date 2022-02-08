import React, { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  TouchableOpacity,
  Linking,
} from "react-native";
import * as yup from "yup";
import { Formik } from "formik";
import { loginStyles } from "../styles/loginStyles";
import { Routes } from "../navigator/Routes";
import { CustomText } from "../highordercomponents";
import { globalStyles } from "../styles/globalStyles";
import { RFValue } from "react-native-responsive-fontsize";
import { fetchHandler, toastGenerator } from "../helper/helper";
import { Eye, EyeSlash } from "../assets/svg/illustrations";
import MapilioLogo from "../assets/svg/logos/MapilioLogo";
import { errorAlertStyles, successAlertStyles } from "../styles/alertStyles";
import { SERVICE_URL } from "@env";
import { SocialLogin } from "../components";

const Register = ({ navigation }) => {
  const [securePassword, setSecurePassword] = useState(true);

  const register = (values) => {
    fetchHandler({
      url: `${SERVICE_URL}/api/register`,
      method: "POST",
      data: {
        name: values.name,
        username: values.name,
        email: values.email,
        password: values.password,
        callback: `${SERVICE_URL}`,
        "success-params": "tverification=true",
        "error-params": "tverification=false",
      },
    })
      .then((res) => {
        navigation.navigate(Routes.login);
        toastGenerator(
          `Your account has been created, check your e-mail address.`,
          require("../assets/images/Success.png"),
          successAlertStyles.alertContainer,
          successAlertStyles.alertTitle,
          successAlertStyles.alertImage,
          3000
        );
      })
      .catch((err) => {
        Object.values(err.response.data).map((item, i) => {
          toastGenerator(
            `${item[0]}`,
            require("../assets/images/Warning.png"),
            errorAlertStyles.alertContainer,
            errorAlertStyles.alertTitle,
            errorAlertStyles.alertImage,
            3000
          );
        });
      });
  };

  const redirectBrowser = () => {
    Linking.openURL("https://mapilio.com/privacy").catch((err) => {
      toastGenerator(
        "An error occurred while redirecting, please try again.",
        require("../assets/images/Info.png"),
        errorAlertStyles.alertContainer,
        errorAlertStyles.alertTitle,
        errorAlertStyles.alertImage
      );
    });
  };

  const loginValidationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Please enter valid email")
      .required("Email Address is Required"),
    password: yup
      .string()
      .min(8, ({ min }) => `Password must be at least ${min} characters`)
      .required("Password is required"),
  });

  return (
    <View style={[globalStyles.container, loginStyles.container]}>
      <View style={loginStyles.logo}>
        <MapilioLogo width={RFValue(150)} height={RFValue(50)} />
      </View>
      <View style={{ marginBottom: RFValue(30) }}>
        <CustomText style={loginStyles.primaryText}>
          Create an account
        </CustomText>
        <CustomText style={loginStyles.secondaryText}>
          Fill out the form to get started.
        </CustomText>
      </View>
      <SocialLogin navigation={navigation} />
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
        }}
        validateOnBlur={false}
        validateOnChange={false}
        validationSchema={loginValidationSchema}
        onSubmit={(values) => register(values)}
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
                name="name"
                placeholder="Name"
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
                keyboardType="default"
                style={
                  errors.name
                    ? { ...loginStyles.errorInput, ...loginStyles.input }
                    : loginStyles.input
                }
              />
              {errors.name && (
                <CustomText style={loginStyles.errorText}>
                  {errors.name}
                </CustomText>
              )}
            </View>
            <View style={loginStyles.formGroup}>
              <TextInput
                name="email"
                placeholder="Email Address"
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
              Already have an account?
              <CustomText
                style={{ ...loginStyles.link, fontSize: RFValue(14) }}
                onPress={() => navigation.navigate(Routes.login)}
              >
                {" "}
                Log In
              </CustomText>
              .
            </CustomText>
            <Pressable style={loginStyles.button} onPress={handleSubmit}>
              <CustomText
                style={{ ...loginStyles.secondaryText, color: "#fff" }}
              >
                Sign up
              </CustomText>
            </Pressable>
            <CustomText style={loginStyles.privacyText}>
              By clicking "Sign up" button you agree with our
            </CustomText>
            <CustomText style={loginStyles.link} onPress={redirectBrowser}>
              Privacy policy
            </CustomText>
          </>
        )}
      </Formik>
    </View>
  );
};
export default Register;

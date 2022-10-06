import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Linking, ActivityIndicator,
} from "react-native";
import * as yup from "yup";
import { loginStyles } from "../styles/loginStyles";
import { Routes } from "../navigator/Routes";
import { CustomText } from "../highordercomponents";
import { globalStyles } from "../styles/globalStyles";
import { RFValue } from "react-native-responsive-fontsize";
import { fetchHandler } from "../helper/helper";
import { Eye, EyeSlash } from "../assets/svg/illustrations";
import MapilioLogo from "../assets/svg/logos/MapilioLogo";
import { SocialLogin } from "../components";
import {useForm, Controller} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {toastMessage} from "../helper/alerts";
import Config from "react-native-config";

const registerValidationSchema = yup.object().shape({
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

const Register = ({ navigation }) => {
  const [securePassword, setSecurePassword] = useState(true);
  const [loading, setLoading] = useState(false);

  const register = (values) => {
    fetchHandler({
      url: `${Config.SERVICE_URL}/api/register`,
      method: "POST",
      data: {
        name: values.name,
        username: values.name,
        email: values.email,
        password: values.password,
        callback: `${Config.SERVICE_URL}`,
        "success-params": "tverification=true",
        "error-params": "tverification=false",
      },
    })
      .then(() => {
        navigation.reset({index: 0, routes: [{name: Routes.login}]})
        toastMessage.success(`Your account has been created, check your e-mail address.`)
      })
      .catch((err) => {
        Object.values(err.response.data).map((item, _i) => {
          toastMessage.error(`${item[0]}`)
        });
      });
  };

  const redirectBrowser = () => {
    Linking.openURL("https://mapilio.com/privacy").catch(() => {
      toastMessage.error("An error occurred while redirecting, please try again.")
    });
  };

  const {control, handleSubmit, formState: {errors, isSubmitting}} = useForm({
    defaultValues: {name: '', email: '', password: ''},
    resolver: yupResolver(registerValidationSchema),
  });

  React.useEffect(() => setLoading(isSubmitting), [isSubmitting]);

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

      <Controller name={"name"} control={control} render={({field: {onChange, onBlur, value}}) => (        <View style={loginStyles.formGroup}>
          <TextInput
            name="name"
            placeholder="Name"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            keyboardType="default"
            style={
              errors.name
                ? { ...loginStyles.errorInput, ...loginStyles.input }
                : loginStyles.input
            }
          />
          {errors.name && (
            <CustomText style={loginStyles.errorText}>
              {errors.name.message}
            </CustomText>
          )}
        </View>
      )}
      />

      <Controller name={"email"} control={control} render={({field: {onChange, onBlur, value}}) => (
        <View style={loginStyles.formGroup}>
          <TextInput
            name="email"
            placeholder="Email Address"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
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
              {errors.email.message}
            </CustomText>
          )}
        </View>
      )}
      />

      <Controller name={"password"} control={control} render={({field: {onChange, onBlur, value}}) => (
        <View style={loginStyles.formGroup}>
          <View style={{ justifyContent: "center" }}>
            <TextInput
              name="password"
              placeholder="Password"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
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
              {errors.password.message}
            </CustomText>
          )}
        </View>
      )} />


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
      <TouchableOpacity
        style={loginStyles.button}
        disabled={loading}
        onPress={handleSubmit((values) => register(values))}
      >
        <CustomText
          style={{ ...loginStyles.secondaryText, color: "#fff" }}
        >
          {loading ? (<ActivityIndicator size={"small"} color={"#FFFFFF"}/>) : "Sign up"}
        </CustomText>
      </TouchableOpacity>
      <CustomText style={loginStyles.privacyText}>
        By clicking "Sign up" button you agree with our
      </CustomText>
      <CustomText style={loginStyles.link} onPress={redirectBrowser}>
        Privacy policy
      </CustomText>
    </View>
  );
};
export default Register;

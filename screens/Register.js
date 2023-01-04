import React, {useState} from "react";
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
import { RFValue } from "react-native-responsive-fontsize";
import { fetchHandler } from "../helper/helper";
import { Eye } from "../assets/svg/illustrations";
import { SocialLogin } from "../components";
import {useForm, Controller} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import Config from "react-native-config";
import {globalStyles} from "../styles/globalStyles";
import SafeAreaView from "react-native-safe-area-view";
import {MapilioLogoBeta} from "../assets/svg/logos";
import FocusAwareStatusBar from "../components/FocusAwareStatusBar";

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
  const [toggleEye, setToggleEye] = useState(false);
  const [loading, setLoading] = useState(false);

  const register = (values) => {
    setLoading(true)
    fetchHandler({
      url: `${Config.SERVICE_URL}/api/register`,
      method: "POST",
      data: {
        name: values.name,
        username: values.name,
        email: values.email,
        password: values.password,
        callback: `https://mapilio.com?deeplink=mapilio://`,
        "success-params": "tverification=true",
        "error-params": "tverification=false",
      },
    }).then(() => {
      navigation.reset({index: 0, routes: [{name: Routes.login}]})
      toast.show(`Your account has been created, check your e-mail address.`, {type: "success"})
    }).catch((err) => {
      Object.values(err.response.data).map((item, _i) => {
        toast.show(`${item[0]}`, {type: "error"})
      });
    }).finally(() => setLoading(false))
  };

  const redirectBrowser = () => {
    Linking.openURL("https://mapilio.com/privacy").catch(() => {
      toast.show(`An error occurred while redirecting, please try again.`, {type: "error"})
    });
  };

  const {control, handleSubmit, formState: {errors, isSubmitting}} = useForm({
    defaultValues: {name: '', email: '', password: ''},
    resolver: yupResolver(registerValidationSchema),
  });


  return (
    <SafeAreaView style={[globalStyles.container, loginStyles.container]}>
			<FocusAwareStatusBar barStyle="light-content" backgroundColor={"#130C47"}/>
      <View>
        <View style={loginStyles.logo}>
          <MapilioLogoBeta width={RFValue(248)} height={RFValue(50)}/>
        </View>
        <View style={{marginBottom: RFValue(30)}}>
          <CustomText style={loginStyles.headerText}>
            Sign up to see what's on your map.
          </CustomText>
        </View>

        <Controller name={"name"} control={control} render={({field: {onChange, onBlur, value}}) => (
          <View style={loginStyles.formGroup}>
            {errors.name && <CustomText style={loginStyles.errorText}>{errors.name.message}</CustomText>}
            <TextInput
              name="name"
              placeholder="Name"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              keyboardType="default"
              style={errors.name ? {...loginStyles.input,...loginStyles.errorInput} : loginStyles.input}
            />
          </View>
        )}/>
        <Controller name={"email"} control={control} render={({field: {onChange, onBlur, value}}) => (
          <View style={loginStyles.formGroup}>
            {errors.email && <CustomText style={loginStyles.errorText}>{errors.email.message}</CustomText>}
            <TextInput
              name="email"
              placeholder="Email Address"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              keyboardType="email-address"
              autoCapitalize="none"
              style={errors.email ? {...loginStyles.input, ...loginStyles.errorInput} : loginStyles.input}
            />
          </View>
        )}/>
        <Controller name={"password"} control={control} render={({field: {onChange, onBlur, value}}) => (
          <View style={loginStyles.formGroup}>
            <View style={{ justifyContent: "center" }}>
              {errors.password && <CustomText style={loginStyles.errorText}>{errors.password.message}</CustomText>}

              <TextInput
                name="password"
                placeholder="Password"
                onChangeText={(e) => {
                  setToggleEye(!!e.length)
                  onChange(e)
                }}
                onBlur={onBlur}
                value={value}
                style={errors.password ? {...loginStyles.input, ...loginStyles.errorInput} : loginStyles.input}
                secureTextEntry={securePassword}
              />
              <TouchableOpacity
                style={loginStyles.passwordIcon}
                onPressIn={() => setSecurePassword(false)}
                onPressOut={() => setSecurePassword(true)}
              >
                {toggleEye && <Eye/>}
              </TouchableOpacity>
            </View>
          </View>
        )} />
        <TouchableOpacity
          style={loginStyles.button}
          disabled={loading}
          onPress={handleSubmit((values) => register(values))}
        >
          <CustomText
            style={{ ...loginStyles.secondaryText, color: "#fff" }}
          >
            {loading ? (<ActivityIndicator size={"large"} color={"#FFFFFF"}/>) : "Sign up"}
          </CustomText>
        </TouchableOpacity>
        <View style={{marginTop: RFValue(21)}}>
          <SocialLogin navigation={navigation} />
        </View>
      </View>
      <View style={loginStyles.policy}>
        <CustomText style={loginStyles.privacyText}>
          By clicking "Sign up" button you agree with our
        </CustomText>
        <CustomText style={loginStyles.link} onPress={redirectBrowser}>
          Privacy policy
        </CustomText>
      </View>

    </SafeAreaView>
  );
};
export default Register;

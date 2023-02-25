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
import { Eye } from "../assets/svg/illustrations";
import { SocialLogin } from "../components";
import {useForm, Controller} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {globalStyles} from "../styles/globalStyles";
import SafeAreaView from "react-native-safe-area-view";
import {MapilioLogoBeta} from "../assets/svg/logos";
import FocusAwareStatusBar from "../components/FocusAwareStatusBar";
import {Trans, useTranslation} from "react-i18next";
import {api} from "../util/helpers/api";



const Register = ({ navigation }) => {
  const {t} = useTranslation("register");
  const [securePassword, setSecurePassword] = useState(true);
  const [toggleEye, setToggleEye] = useState(false);
  const [loading, setLoading] = useState(false);

  const registerValidationSchema = yup.object().shape({
    name: yup.string().required(t("name_required")),
    email: yup.string().email(t("email_not_valid")).required(t("email_required")),
    password: yup.string().min(8, ({min}) => t("pass_min_character", {min})).required("Password is required"),
  });

  const register = (values) => {
    setLoading(true)

    api.post("/api/register", {
      name: values.name,
      username: values.name,
      email: values.email,
      password: values.password,
      callback: `https://mapilio.com?deeplink=mapilio://`,
      "success-params": "tverification=true",
      "error-params": "tverification=false",
    }).then(() => {
      navigation.reset({index: 0, routes: [{name: Routes.login}]})
      toast.show(t("account_created"), {type: "success"})
    }).catch((err) => {
      Object.values(err.response.data).map((item, _i) => {
        toast.show(`${item[0]}`, {type: "error"})
      });
    }).finally(() => setLoading(false))
  }

  const redirectBrowser = () => {
    Linking.openURL("https://mapilio.com/privacy").catch(() => {
      toast.show(t("redirect_error"), {type: "error"})
    });
  };

  const {control, handleSubmit, formState: {errors}} = useForm({
    defaultValues: {name: '', email: '', password: ''},
    resolver: yupResolver(registerValidationSchema),
  });


  return (
    <SafeAreaView style={[globalStyles.container, loginStyles.container]}>
			<FocusAwareStatusBar barStyle="dark-content"/>
      <View>
        <View style={loginStyles.logo}>
          <MapilioLogoBeta width={RFValue(218)} height={RFValue(43)}/>
        </View>
        <View style={{marginBottom: RFValue(30)}}>
          <CustomText style={loginStyles.headerText}>
            {t("title")}
          </CustomText>
        </View>

        <Controller name={"name"} control={control} render={({field: {onChange, onBlur, value}}) => (
          <View style={loginStyles.formGroup}>
            {errors.name && <CustomText style={loginStyles.errorText}>{errors.name.message}</CustomText>}
            <TextInput
              name="name"
              placeholder={t("name")}
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
              placeholder={t("email")}
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
                placeholder={t("password")}
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
            {loading ? (<ActivityIndicator size={"large"} color={"#FFFFFF"}/>) : t("signup")}
          </CustomText>
        </TouchableOpacity>
        <View style={{marginTop: RFValue(18)}}>
          <SocialLogin navigation={navigation} />
        </View>
      </View>
      <View style={loginStyles.policy}>

        <CustomText style={loginStyles.privacyText}>
          <Trans
            t={t}
            i18nKey={"policy"}
            components={[<CustomText style={loginStyles.link} onPress={redirectBrowser}/>]}
          />
        </CustomText>
      </View>

    </SafeAreaView>
  );
};
export default Register;

import React from "react";
import {Text, View, TextInput, Pressable} from "react-native";
import * as yup from 'yup'
import {Formik} from "formik";
import {loginStyles} from "../styles/loginStyles";
import {Routes} from "../navigator/Routes";
import {globalStyles} from "../styles/globalStyles";
import {RFValue} from "react-native-responsive-fontsize";
import {fetchHandler, toastGenerator} from "../helper/helper";
import MapilioLogo from "../assets/svg/logos/MapilioLogo";
import {errorAlertStyles, successAlertStyles} from "../styles/alertStyles";

const ForgotPassword = ({navigation}) => {

  const loginValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter valid email")
      .required('Email Address is Required'),
  })

  const forgotPassword = (values) => {
    fetchHandler({
      url: `${process.env.API_URL}/api/forgot-password`,
      method: "POST",
      data: {
        email: values.email,
        callback: `${process.env.API_URL}`,
        "success-params": "tverification=true",
        "error-params": "tverification=false",
      },
    })
      .then((res) => {
        navigation.navigate(Routes.login);
        toastGenerator(
          `The reset request has been sent to the e-mail address.`,
          require("../assets/images/Success.png"),
          successAlertStyles.alertContainer,
          successAlertStyles.alertTitle,
          successAlertStyles.alertImage,
          3000
        );
      })
      .catch((err) => {
        toastGenerator(
          `${err.response.data.message}`,
          require("../assets/images/Warning.png"),
          errorAlertStyles.alertContainer,
          errorAlertStyles.alertTitle,
          errorAlertStyles.alertImage,
          3000
        );
      });
  }

  return (

    <View style={[globalStyles.container, loginStyles.container]}>
      <View style={loginStyles.logo}>
        <MapilioLogo width={RFValue(150)} height={RFValue(50)} />
      </View>
      <View style={{
        marginBottom: RFValue(30),
      }}>
        <Text style={loginStyles.primaryText}>Forgot your password?</Text>
        <Text style={loginStyles.secondaryText}>Enter your email address below and we'll
          get you back on track.</Text>
      </View>

      <Formik initialValues={{
        email: '',
      }} validationSchema={loginValidationSchema} onSubmit={values => forgotPassword(values)}>
        {({handleChange, handleBlur, handleSubmit, values, errors, isValid}) => (
          <>
            <View style={{...loginStyles.formGroup, marginBottom: RFValue(40)}}>
              <TextInput
                name="email"
                placeholder="Email Address"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                keyboardType="email-address"
                autoCapitalize='none'
                style={errors.email ? {...loginStyles.errorInput , ...loginStyles.input} : loginStyles. input}
              />
              {errors.email &&
              <Text style={loginStyles.errorText}>{errors.email}</Text>
              }
            </View>

            <Pressable style={{...loginStyles.buttonOutline, marginBottom: RFValue(10)}}
                       onPress={() => navigation.navigate(Routes.login)}>
              <Text style={loginStyles.buttonText}>Back to Log In</Text>
            </Pressable>
            <Pressable style={loginStyles.button} onPress={handleSubmit}>
              <Text style={loginStyles.buttonText}>Send reset link</Text>
            </Pressable>
            <Text style={{...loginStyles.link, marginTop: 40}}>
              Privacy policy
            </Text>
          </>
        )}
      </Formik>
    </View>
  );
};
export default ForgotPassword;
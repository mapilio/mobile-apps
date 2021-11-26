import React, {useEffect, useState} from "react";
import {View, Image, TextInput, Pressable, Alert} from "react-native";
import logo from '../assets/logo.png';
import * as yup from 'yup'
import {Formik} from "formik";
import {loginStyles} from "../styles/loginStyles";
import {Routes} from "../navigator/Routes";
import {CustomText} from "../highordercomponents";
import {globalStyles} from "../styles/globalStyles";
import {useDispatch} from "react-redux";
import {getTokenAction} from "../store/reducers/loginReducer/getTokenAction";
import {RFValue} from "react-native-responsive-fontsize";

const Login = ({navigation}) => {
  const dispatch = useDispatch();

  async function login(values) {
    await dispatch(getTokenAction(values, navigation.navigate));
  }

  const loginValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter valid email")
      .required('Email Address is Required'),
    password: yup
      .string()
      .required('Password is required'),
  })

  return (
    <View style={[globalStyles.container, loginStyles.container]}>
      <Image source={logo} style={loginStyles.logo} resizeMode={"contain"}/>
      <View style={{marginBottom: RFValue(30)}}>
        <CustomText style={loginStyles.secondaryText}>LOGIN</CustomText>
        <CustomText style={loginStyles.primaryText}>Welcome back</CustomText>
        <CustomText style={loginStyles.secondaryText}>Login to manage your account</CustomText>
      </View>

      <Formik initialValues={{
        email: '',
        password: '',
      }} validationSchema={loginValidationSchema} onSubmit={values => login(values)}>
        {({handleChange, handleBlur, handleSubmit, values, errors, isValid}) => (
          <>
            <View style={loginStyles.formGroup}>
              <TextInput
                name="email"
                placeholder="Email Address"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                keyboardType="email-address"
                style={loginStyles.input}
              />
              {errors.email &&
              <CustomText style={loginStyles.errorText}>{errors.email}</CustomText>
              }
            </View>
            <View style={loginStyles.formGroup}>
              <CustomText
                onPress={() => navigation.navigate(Routes.forgotPassword)}
                style={{...loginStyles.link, textAlign: 'right'}}
              >Forgot your password?</CustomText>
              <TextInput
                name="password"
                placeholder="Password"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                style={loginStyles.input}
                secureTextEntry
              />
              {errors.password &&
              <CustomText style={loginStyles.errorText}>{errors.password}</CustomText>
              }
            </View>

            <CustomText style={loginStyles.smallText}>Don't have and account yet?
              <CustomText style={{...loginStyles.link, fontSize: RFValue(14)}}
                          onPress={() => navigation.navigate(Routes.register)}> Sign up here</CustomText>.
            </CustomText>
            <Pressable style={loginStyles.button} onPress={handleSubmit}>
              <CustomText style={{...loginStyles.secondaryText, color: '#fff'}}>Log In</CustomText>
            </Pressable>
            <CustomText style={{...loginStyles.link, marginTop: RFValue(40)}}>
              Privacy policy
            </CustomText>
          </>
        )}
      </Formik>
    </View>
  );
};
export default Login;
import React from "react";
import {View, Image, TextInput, Pressable, ToastAndroid} from "react-native";
import logo from '../assets/logo.png';
import * as yup from 'yup'
import {Formik} from "formik";
import {loginStyles} from "../styles/loginStyles";
import {Routes} from "../navigator/Routes";
import {CustomText} from "../highordercomponents";
import {globalStyles} from "../styles/globalStyles";
import {RFValue} from "react-native-responsive-fontsize";
import {fetchHandler} from "../helper/helper";

const Register = ({navigation}) => {

  const register = (values) => {
    fetchHandler({
      url: `https://end.mapilio.com/api/register`,
      method: "POST",
      data: {
        name: values.name,
        username: values.name,
        email: values.email,
        password: values.password,
        callback: 'https://end.mapilio.com',
        "success-params": "tverification=true",
        "error-params": "tverification=false",
      },
    })
      .then((res) => {
        navigation.navigate(Routes.login);
        ToastAndroid.show('Your account has been created, check your e-mail address.', ToastAndroid.SHORT);
      })
      .catch((err) => {
        Object.values(err.response.data).map((item, i )=> {
          ToastAndroid.show(item[0], ToastAndroid.SHORT);
        })
      });
  }

  const loginValidationSchema = yup.object().shape({
    name: yup
      .string()
      .required('Name is required'),
    email: yup
      .string()
      .email("Please enter valid email")
      .required('Email Address is Required'),
    password: yup
      .string()
      .min(8, ({min}) => `Password must be at least ${min} characters`)
      .required('Password is required'),
  })

  return (
    <View style={[globalStyles.container, loginStyles.container]}>
      <Image source={logo} style={loginStyles.logo} resizeMode={"contain"}/>
      <View style={{marginBottom: RFValue(30)}}>
        <CustomText style={loginStyles.secondaryText}>SIGNUP</CustomText>
        <CustomText style={loginStyles.primaryText}>Create an account</CustomText>
        <CustomText style={loginStyles.secondaryText}>Fill out the form to get started.</CustomText>
      </View>

      <Formik initialValues={{
        name: '',
        email: '',
        password: '',
      }} validationSchema={loginValidationSchema} onSubmit={values => register(values)}>
        {({handleChange, handleBlur, handleSubmit, values, errors, isValid}) => (
          <>
            <View style={loginStyles.formGroup}>
              <TextInput
                name="name"
                placeholder="Name"
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                keyboardType="default"
                style={loginStyles.input}
              />
              {errors.name &&
              <CustomText style={loginStyles.errorText}>{errors.name}</CustomText>
              }
            </View>
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

            <CustomText style={loginStyles.smallText}>Already have an account?
              <CustomText style={{...loginStyles.link, fontSize: RFValue(14)}}
                          onPress={() => navigation.navigate(Routes.login)}> Log In</CustomText>.
            </CustomText>
            <Pressable style={loginStyles.button} onPress={handleSubmit}>
              <CustomText style={{...loginStyles.secondaryText, color: '#fff'}}>Sign up</CustomText>
            </Pressable>
            <CustomText style={loginStyles.privacyText}>
              By clicking "Sign up" button you agree with our
            </CustomText>
            <CustomText style={loginStyles.link}>Privacy policy</CustomText>
          </>
        )}
      </Formik>
    </View>
  );
};
export default Register;
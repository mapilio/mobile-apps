import React, {useEffect, useState} from "react";
import {
	ActivityIndicator,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import * as yup from "yup";
import {loginStyles} from "../styles/loginStyles";
import {Routes} from "../navigator/Routes";
import {CustomText} from "../highordercomponents";
import {globalStyles} from "../styles/globalStyles";
import {useDispatch} from "react-redux";
import {getTokenAction} from "../store/reducers/loginReducer/getTokenAction";
import {RFValue} from "react-native-responsive-fontsize";
import {Eye} from "../assets/svg/illustrations";
import {SocialLogin} from "../components";
import {useForm, Controller} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import SafeAreaView from "react-native-safe-area-view";
import {MapilioLogoBeta} from "../assets/svg/logos";

const loginValidationSchema = yup.object().shape({
	email: yup.string()
		.email("You have entered an invalid username and password")
		.required("Email Address is Required"),
	password: yup.string().required("Password is required"),
});

const Login = ({navigation}) => {
	const dispatch = useDispatch();
	const [securePassword, setSecurePassword] = useState(true);
	const [toggleEye, setToggleEye] = useState(false);
	const [loading, setLoading] = useState(false);

	const {control, handleSubmit, formState: {errors, isSubmitting}} = useForm({
		defaultValues: {email: '', password: ''},
		resolver: yupResolver(loginValidationSchema),
	});

	useEffect(() => setLoading(isSubmitting), [isSubmitting]);

	return (
		<SafeAreaView style={[globalStyles.container, loginStyles.container]}>
			<View>
				<View style={loginStyles.logo}>
					<MapilioLogoBeta width={RFValue(248)} height={RFValue(50)}/>
				</View>

				<View style={{marginBottom: RFValue(30)}}>
					<CustomText style={loginStyles.headerText}>
						Sign in to see what's on your map.
					</CustomText>
				</View>

				<Controller name={"email"} control={control} render={({field: {onChange, onBlur, value}}) => (
					<View style={loginStyles.formGroup}>
						{errors.email && <CustomText style={loginStyles.errorText}>{errors.email.message} </CustomText>}
						<TextInput
							name="email"
							placeholder="Email or Username"
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
				)}/>

				<TouchableOpacity
					style={loginStyles.button}
					onPress={handleSubmit((values) => dispatch(getTokenAction(values, navigation.navigate)))}
					disabled={loading}
				>
					<CustomText style={{...loginStyles.secondaryText, color: "#fff"}}>
						{loading ? (<ActivityIndicator size={"small"} color={"#FFFFFF"}/>) : "Log In"}
					</CustomText>
				</TouchableOpacity>
				<CustomText
					onPress={() => navigation.navigate(Routes.forgotPassword)}
					style={{...loginStyles.privacyText, marginVertical: RFValue(21)}}
				>
					Forgot your password?
				</CustomText>

				<SocialLogin navigation={navigation}/>

			</View>
		</SafeAreaView>
	);
};
export default Login;

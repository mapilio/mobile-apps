import React, {useState} from "react";
import {ActivityIndicator, TextInput, TouchableOpacity, View} from "react-native";
import * as yup from "yup";
import {loginStyles} from "../styles/loginStyles";
import {Routes} from "../navigator/Routes";
import {CustomText} from "../highordercomponents";
import {globalStyles} from "../styles/globalStyles";
import {RFValue} from "react-native-responsive-fontsize";
import {Eye} from "../assets/svg/illustrations";
import {SocialLogin} from "../components";
import {useForm, Controller} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import SafeAreaView from "react-native-safe-area-view";
import {MapilioLogoBeta} from "../assets/svg/logos";
import {fetchLogin} from "../helper/user";
import FocusAwareStatusBar from "../components/FocusAwareStatusBar";
import {useTranslation} from "react-i18next";
import {LanguageModal} from "../components/Login";

const Login = ({navigation}) => {
	const {t} = useTranslation("login");
	const [securePassword, setSecurePassword] = useState(true);
	const [toggleEye, setToggleEye] = useState(false);
	const [loading, setLoading] = useState(false);

	const loginValidationSchema = yup.object().shape({
		email: yup.string().email('please_enter_valid_email').required('email_required',),
		password: yup.string().required('password_required'),
	});

	const {control, handleSubmit, formState: {errors: {email: emailError, password: passwordError}}} = useForm({
		defaultValues: {email: '', password: ''},
		resolver: yupResolver(loginValidationSchema),
	});

	const handleLogin = (values) => {
		const {email, password} = values;
		setLoading(true);
		fetchLogin(email, password).then(() => {
			navigation.goBack();
		}).catch((err) => {
			toast.show(`${err}`, {type: "error"})
		}).finally(() => setLoading(false))
	}

	return (
		<SafeAreaView style={[globalStyles.container, loginStyles.container]}>
			<View>
			<FocusAwareStatusBar barStyle="light-content"  />
				<View style={loginStyles.logo}>
					<MapilioLogoBeta width={RFValue(218)} height={RFValue(43)}/>
				</View>

				<View style={{marginBottom: RFValue(30)}}>
					<CustomText style={loginStyles.headerText}>
						{t("title")}
					</CustomText>
				</View>

				<Controller name={"email"} control={control} render={({field: {onChange, onBlur, value}}) => (
					<View style={loginStyles.formGroup}>
						{emailError && <CustomText style={loginStyles.errorText}>{t(emailError.message, {ns: 'form'})} </CustomText>}
						<TextInput
							name="email"
							placeholder={t("email_username")}
							onChangeText={onChange}
							onBlur={onBlur}
							value={value}
							keyboardType="email-address"
							autoCapitalize="none"
							style={emailError ? {...loginStyles.input, ...loginStyles.errorInput} : loginStyles.input}
						/>
					</View>
				)}/>

				<Controller name={"password"} control={control} render={({field: {onChange, onBlur, value}}) => (
					<View style={loginStyles.formGroup}>
						{passwordError && <CustomText style={loginStyles.errorText}>{t(passwordError.message, {ns: "form"})}</CustomText>}
						<TextInput
							name="password"
							placeholder={t("password")}
							onChangeText={(e) => {
								setToggleEye(!!e.length)
								onChange(e)
							}}
							onBlur={onBlur}
							value={value}
							style={passwordError ? {...loginStyles.input, ...loginStyles.errorInput} : loginStyles.input}
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
					onPress={handleSubmit((values) => handleLogin(values))}
					disabled={loading}
				>
					<CustomText style={{...loginStyles.secondaryText, color: "#fff"}}>
						{loading ? (<ActivityIndicator size={"large"} color={"#FFFFFF"}/>) : t("login")}
					</CustomText>
				</TouchableOpacity>
				<CustomText
					onPress={() => navigation.navigate(Routes.forgotPassword)}
					style={{...loginStyles.forgotPassword, marginVertical: RFValue(18)}}
				>
					{t("forgot_password")}
				</CustomText>

				<SocialLogin navigation={navigation}/>
			</View>

			<LanguageModal />
		</SafeAreaView>
	);
};
export default Login;

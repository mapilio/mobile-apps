import React, {useState} from "react";
import {
	ActivityIndicator,
	ScrollView,
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
import {Eye, EyeSlash} from "../assets/svg/illustrations";
import MapilioLogo from "../assets/svg/logos/MapilioLogo";
import {SocialLogin} from "../components";
import {useForm, Controller} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';

const loginValidationSchema = yup.object().shape({
	email: yup
		.string()
		.email("You have entered an invalid username and password")
		.required("Email Address is Required"),
	password: yup.string().required("Password is required"),
});

const Login = ({navigation}) => {
	const dispatch = useDispatch();
	const [securePassword, setSecurePassword] = useState(true);
	const [loading, setLoading] = useState(false);

	const {control, handleSubmit, formState: {errors, isSubmitting}} = useForm({
		defaultValues: {email: '', password: ''},
		resolver: yupResolver(loginValidationSchema),
	});

	React.useEffect(() => setLoading(isSubmitting), [isSubmitting]);

	return (
		<View style={[globalStyles.container, loginStyles.container]}>
			<View>

				<View style={loginStyles.logo}>
					<MapilioLogo width={RFValue(150)} height={RFValue(50)}/>
				</View>

				<View style={{marginBottom: RFValue(30)}}>
					<CustomText style={loginStyles.headerText}>
						Login to manage your account
					</CustomText>
				</View>

				<ScrollView>
					<SocialLogin navigation={navigation}/>

					<Controller name={"email"} control={control} render={({field: {onChange, onBlur, value}}) => (
						<View style={loginStyles.formGroup}>
							<TextInput
								name="email"
								placeholder="Email or Username"
								onChangeText={onChange}
								onBlur={onBlur}
								value={value}
								keyboardType="email-address"
								autoCapitalize="none"
								style={errors.email ? {...loginStyles.errorInput, ...loginStyles.input} : loginStyles.input}
							/>
							{errors.email && <CustomText style={loginStyles.errorText}>{errors.email.message} </CustomText>}
						</View>
					)}
					/>

					<Controller name={"password"} control={control} render={({field: {onChange, onBlur, value}}) => (
						<View style={loginStyles.formGroup}>
							<CustomText
								onPress={() => navigation.navigate(Routes.forgotPassword)}
								style={{...loginStyles.link, textAlign: "right"}}
							>
								Forgot your password?
							</CustomText>
							<View style={{justifyContent: "center"}}>
								<TextInput
									name="password"
									placeholder="Password"
									onChangeText={onChange}
									onBlur={onBlur}
									value={value}
									style={errors.password ? {...loginStyles.errorInput, ...loginStyles.input} : loginStyles.input}
									secureTextEntry={securePassword}
								/>
								<TouchableOpacity
									style={loginStyles.passwordIcon}
									onPress={() => setSecurePassword(!securePassword)}
								>
									{securePassword ? <Eye/> : <EyeSlash/>}
								</TouchableOpacity>
							</View>
							{errors.password && <CustomText style={loginStyles.errorText}>{errors.password.message}</CustomText>}
						</View>
					)}
					/>
					<CustomText style={loginStyles.smallText}>
						Don't have an account yet?
						<CustomText
							style={{...loginStyles.link, fontSize: RFValue(14)}}
							onPress={() => navigation.navigate(Routes.register)}
						>
							{" "}
							Sign up here
						</CustomText>
					</CustomText>
					<TouchableOpacity
						style={loginStyles.button}
						onPress={handleSubmit((values) => dispatch(getTokenAction(values, navigation.navigate)))}
						disabled={loading}
					>
						<CustomText style={{...loginStyles.secondaryText, color: "#fff"}}>
							{loading ? (<ActivityIndicator size={"small"} color={"#FFFFFF"}/>) : "Log In"}
						</CustomText>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							navigation.navigate(Routes.nonUserTab);
						}}
					>
						<CustomText
              style={{fontSize: RFValue(14), color: "#22CC69", marginTop: RFValue(15), textAlign: "center"}}
						>
							Continue without a member
						</CustomText>
					</TouchableOpacity>
				</ScrollView>
			</View>
		</View>
	);
};
export default Login;

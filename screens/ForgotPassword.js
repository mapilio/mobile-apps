import React, {useState} from "react";
import {Text, View, TextInput, TouchableOpacity, ActivityIndicator} from "react-native";
import * as yup from "yup";
import {loginStyles} from "../styles/loginStyles";
import {Routes} from "../navigator/Routes";
import {RFValue} from "react-native-responsive-fontsize";
import {fetchHandler} from "../helper/helper";
import MapilioLogo from "../assets/svg/logos/MapilioLogo";
import {useForm, Controller} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {toastMessage} from "../helper/alerts";
import Config from "react-native-config";


const forgotValidationSchema = yup.object().shape({
	email: yup
		.string()
		.email("Please enter valid email")
		.required("Email Address is Required"),
});

const ForgotPassword = ({navigation}) => {
	const [loading, setLoading] = useState(false);
	const {control, handleSubmit, formState: {errors, isSubmitting}} = useForm({
		defaultValues: {email: ''},
		resolver: yupResolver(forgotValidationSchema),
	});
	React.useEffect(() => setLoading(isSubmitting), [isSubmitting]);

	const forgotPassword = (values) => {
		fetchHandler({
			url: `${Config.SERVICE_URL}/api/forgot-password`,
			method: "POST",
			data: {
				email: values.email,
				callback: Config.FORGOT_URL,
				"success-params": "tverification=true",
				"error-params": "tverification=false",
			},
		})
			.then(() => {
				navigation.reset({index: 0, routes: [{name: Routes.login}]})
				toastMessage.success(`The reset request has been sent to the e-mail address.`)
			})
			.catch((err) => toastMessage.error(err.response.data.message));
	};

	return (
		<View style={loginStyles.container}>
			<View style={loginStyles.logo}>
				<MapilioLogo width={RFValue(150)} height={RFValue(50)}/>
			</View>
			<View
				style={{
					marginBottom: RFValue(30),
				}}
			>
				<Text style={loginStyles.primaryText}>Forgot your password?</Text>
				<Text style={loginStyles.secondaryText}>
					Enter your email address below and we'll get you back on track.
				</Text>
			</View>

			<Controller name={"email"} control={control} render={({field: {onChange, onBlur, value}}) => (
				<View
					style={{...loginStyles.formGroup, marginBottom: RFValue(40)}}
				>
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
								? {...loginStyles.errorInput, ...loginStyles.input}
								: loginStyles.input
						}
					/>
					{errors.email && (
						<Text style={loginStyles.errorText}>{errors.email.message}</Text>
					)}
				</View>
			)}/>
			<TouchableOpacity
				style={{
					...loginStyles.buttonOutline,
					marginBottom: RFValue(10),
				}}
				onPress={() => navigation.navigate(Routes.login)}
			>
				<Text style={loginStyles.buttonText}>Back to Log In</Text>
			</TouchableOpacity>
			<TouchableOpacity style={loginStyles.button} onPress={handleSubmit((values) => forgotPassword(values))}>
				<Text style={loginStyles.buttonText}>
					{loading ? (<ActivityIndicator size={"small"} color={"#FFFFFF"}/>) : "Send reset link"}
				</Text>
			</TouchableOpacity>

		</View>
	);
};
export default ForgotPassword;

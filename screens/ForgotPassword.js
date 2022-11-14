import React, {useEffect, useState} from "react";
import {Text, View, TextInput, TouchableOpacity, ActivityIndicator} from "react-native";
import * as yup from "yup";
import {loginStyles} from "../styles/loginStyles";
import {Routes} from "../navigator/Routes";
import {RFValue} from "react-native-responsive-fontsize";
import {fetchHandler} from "../helper/helper";
import {useForm, Controller} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {toastMessage} from "../helper/alerts";
import Config from "react-native-config";
import {CustomText, CustomTextBold} from "../highordercomponents";


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
	useEffect(() => setLoading(isSubmitting), [isSubmitting]);

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
		}).then(() => {
			navigation.reset({index: 0, routes: [{name: Routes.login}]})
			toastMessage.success(`The reset request has been sent to the e-mail address.`)
		}).catch((err) => toastMessage.error(err.response.data.message));
	};

	return (
		<View style={loginStyles.container}>
			<View style={{marginBottom: RFValue(30)}}>
				<CustomTextBold style={loginStyles.primaryText}>Forgot your password?</CustomTextBold>
				<CustomText style={loginStyles.secondaryText}>
					Enter your email associated with Mapilio account. We'll sent you link to reset your password.
				</CustomText>
			</View>

			<Controller name={"email"} control={control} render={({field: {onChange, onBlur, value}}) => (
				<View style={{...loginStyles.formGroup}}>
					{errors.email && <Text style={loginStyles.errorText}>{errors.email.message}</Text>}
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
			<TouchableOpacity style={loginStyles.button} onPress={handleSubmit((values) => forgotPassword(values))}>
				<Text style={loginStyles.buttonText}>
					{loading ? (<ActivityIndicator size={"small"} color={"#FFFFFF"}/>) : "Send reset link"}
				</Text>
			</TouchableOpacity>

		</View>
	);
};
export default ForgotPassword;

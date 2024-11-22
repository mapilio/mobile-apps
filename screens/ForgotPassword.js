import React, {useState} from "react";
import {Text, View, TextInput, TouchableOpacity} from "react-native";
import * as yup from "yup";
import {loginStyles} from "../styles/loginStyles";
import {Routes} from "../navigator/Routes";
import {RFValue} from "react-native-responsive-fontsize";
import {useForm, Controller} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";

import {CustomText, CustomTextBold} from "../highordercomponents";
import FocusAwareStatusBar from "../components/FocusAwareStatusBar";
import {useTranslation} from "react-i18next";
import {api} from "../util/helpers/api";
import { ActivityIndicator } from "react-native-paper";


const forgotValidationSchema = yup.object().shape({
	email: yup.string().email('please_enter_valid_email').required('email_required'),
});

const ForgotPassword = ({navigation}) => {
	const {t} = useTranslation("forgot");
	const [loading, setLoading] = useState(false);
	const {control, handleSubmit, formState: {errors}} = useForm({
		defaultValues: {email: ''},
		resolver: yupResolver(forgotValidationSchema),
	});

	const forgotPassword = (values) => {
		setLoading(true);
		api.post(`/api/forgot-password`, {
			email: values.email,
			callback: process.env.EXPO_PUBLIC_FORGOT_URL,
			"success-params": "tverification=true",
			"error-params": "tverification=false",
		}, {
			headers: {
				'Content-Type': 'multipart/form-data'}
		}).then(() => {
			navigation.reset({index: 0, routes: [{name: Routes.login}]})
			toast.show(t("reset_success"), {type: "success"})
		}).catch((err) => toast.show(`${err.response.data.message}`, {type: "error"})).finally(() => setLoading(false));
	};

	return (
		<View style={loginStyles.container}>
			<FocusAwareStatusBar barStyle="dark-content" backgroundColor={"#fff"} translucent/>
			<View style={{marginBottom: RFValue(30)}}>
				<CustomTextBold style={loginStyles.primaryText}>
					{t("title")}
				</CustomTextBold>
				<CustomText style={loginStyles.secondaryText}>
					{t("description")}
				</CustomText>
			</View>

			<Controller name={"email"} control={control} render={({field: {onChange, onBlur, value}}) => (
				<View style={{...loginStyles.formGroup}}>
					{errors.email && <Text style={loginStyles.errorText}>{t(errors.email.message, {ns: "form"})}</Text>}
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
			<TouchableOpacity style={loginStyles.button} onPress={handleSubmit((values) => forgotPassword(values))}>
				<Text style={loginStyles.buttonText}>
					{loading ? (<ActivityIndicator size={"small"} color={"#FFFFFF"}/>) : t("reset_link")}
				</Text>
			</TouchableOpacity>

		</View>
	);
};
export default ForgotPassword;

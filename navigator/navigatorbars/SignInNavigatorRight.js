import React from 'react'
import {RFValue} from "react-native-responsive-fontsize";
import {CustomText} from "../../highordercomponents";
import {TouchableOpacity} from "react-native";
import {Routes} from '../Routes'

const SignInNavigatorRight = ({navigation}) => (
    <TouchableOpacity style={{flexDirection: "row", marginRight: RFValue(10), alignItems: "center"}}
                      onPress={() => navigation.navigate(Routes.login)}>
        <CustomText style={{fontSize: RFValue(12), color: "#B9C0CF", marginLeft: RFValue(6)}}>
            Login
        </CustomText>
    </TouchableOpacity>
)

export default SignInNavigatorRight
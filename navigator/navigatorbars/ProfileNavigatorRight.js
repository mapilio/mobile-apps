import React from "react";
import { CustomText } from "../../highordercomponents";
import { RFValue } from "react-native-responsive-fontsize";
import { TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { EXIT_USER } from "../../store/actionsName";
import { Routes } from "../Routes";

const ProfileNavigatorRight = ({ navigation }) => {
  const dispatch = useDispatch();

  const exitHandler = () => {
    navigation.navigate(Routes.map);
    dispatch({ type: EXIT_USER });
  };

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        marginRight: RFValue(14),
        alignItems: "center",
      }}
      onPress={exitHandler}
    >
      <CustomText
        style={{
          fontSize: RFValue(12),
          color: "#B9C0CF",
          marginLeft: RFValue(6),
        }}
      >
        Sign out
      </CustomText>
    </TouchableOpacity>
  );
};

export default ProfileNavigatorRight;

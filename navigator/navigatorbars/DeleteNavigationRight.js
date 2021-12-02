import React from "react";
import {View, TouchableOpacity, Alert} from "react-native";
import {Trash} from "../../assets/svg/illustrations";
import {deleteRight} from "../../styles/navigatorBarStyles";
import {CustomText} from "../../highordercomponents";

const DeleteNavigationRight = (props) => (
  <View>
    <TouchableOpacity onPress={() => {
      Alert.alert(
        "Are you sure?",
        "Are you sure you want to delete this photo",
        [
          {
            text: "Yes",
            onPress: () => {}
          },
          {
            text: "No",
          }
        ]
      )
    }}>
      <CustomText style={deleteRight.text}>
        <Trash width={16.56} height={20.32}/>
        {" "}
        Delete
      </CustomText>
    </TouchableOpacity>
  </View>
);

export default DeleteNavigationRight;

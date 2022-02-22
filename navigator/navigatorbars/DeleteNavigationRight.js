import React from "react";
import { View, TouchableOpacity, Alert, Platform } from "react-native";
import { Trash } from "../../assets/svg/illustrations";
import { deleteRight } from "../../styles/navigatorBarStyles";
import { CustomText } from "../../highordercomponents";
import { useSelector } from "react-redux";
import db from "../../db";
import * as FileSystem from "expo-file-system";
import { Routes } from "../Routes";
import { toastGenerator } from "../../helper/helper";
import { errorAlertStyles } from "../../styles/alertStyles";

const DeleteNavigationRight = (props) => {
  const { rank } = useSelector((state) => state.uploadReducer);

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          Alert.alert(
            "Are you sure?",
            "Are you sure you want to delete this photo",
            [
              {
                text: "Yes",
                onPress: () => {
                  try {
                    db.query(
                      `SELECT id, path FROM captures WHERE id=${rank.id}`,
                      (_, result) => {
                        FileSystem.deleteAsync(result.rows._array[0].path).then(
                          () => {
                            db.query(
                              `DELETE FROM captures where id=${rank.id}`,
                              () => {
                                props.navigation.navigate(Routes.sequences);
                              }
                            );
                          }
                        );
                      }
                    );
                  } catch (e) {
                    toastGenerator(
                      "There was a problem while deleting! Try Again.",
                      require("../../assets/images/Info.png"),
                      errorAlertStyles.alertContainer,
                      errorAlertStyles.alertTitle,
                      errorAlertStyles.alertImage
                    );
                  }
                },
              },
              {
                text: "No",
              },
            ]
          );
        }}
      >
        <CustomText style={deleteRight.text}>
          <Trash width={16.56} height={20.32} /> Delete
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default DeleteNavigationRight;

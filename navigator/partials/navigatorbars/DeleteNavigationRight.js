import React from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as FileSystem from "expo-file-system";
import db from "../../../db";
import {CustomText} from "../../../highordercomponents";
import {deleteRight} from "../../../styles/navigatorBarStyles";
import {Trash} from "../../../assets/svg/illustrations";
import {useNavigation} from "@react-navigation/native";
import {Routes} from "../../Routes";
import {UPLOAD_DATA} from "../../../store/actionsName";

const DeleteNavigationRight = () => {
  const { rank } = useSelector((state) => state.uploadReducer);
  const { activeSequence } = useSelector((state) => state.uploadReducer);
  const dispatch = useDispatch();
  const navigation = useNavigation()

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
                    db.query(`SELECT id, path FROM captures WHERE id=${rank.id}`, (_, result) => {
                      FileSystem.deleteAsync(result.rows._array[0].path).then(() => {
                          db.deleteById(rank.id).then(() => {

                            db.getGroupByWithSequenceUUID().then((data) => {
                              dispatch({type: UPLOAD_DATA, payload: data});

                              const isSequence = data.map((item) => item.sequence_uuid === activeSequence);

                              isSequence.length ?
                                navigation.navigate(Routes.sequences) :
                                navigation.navigate(Routes.upload);
                            })
                          })
                        }
                      ).catch(() => {
                        toast.show("There was a problem while deleting! Try Again.", {type: "error"})
                      })
                    });
                  } catch (e) {
                    toast.show("There was a problem while deleting! Try Again.", {type: "error"})
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

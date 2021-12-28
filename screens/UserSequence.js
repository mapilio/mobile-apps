import React, {useState} from "react";
import {ScrollView, View, TouchableOpacity, Alert} from "react-native";
import Map from "../assets/svg/illustrations/Map";
import {ImageUpload} from "../components/Uploads";
import {userSequenceStyles} from "../styles/userSequenceStyle";
import SwitchSelector from "react-native-switch-selector";
import {Trash} from "../assets/svg/illustrations";
import {userUploadStyles} from "../styles/userUploadStyle";
import {useDispatch, useSelector} from "react-redux";
import database from "../db";
import * as FileSystem from "expo-file-system";
import {SEQUENCE_IMAGES, UPDATE_SELECTED_IMAGES} from "../store/actionsName";

const UserSequence = ({navigation, route}) => {
  const [active, setActive] = useState('image');
  const icons = {
    image: require("../assets/images/imgIcon.png"),
    map: require("../assets/images/mapIcon.png"),
  }
  const sequence_uuid = route.params.id;
  const dispatch = useDispatch();
  const { selectedImages } = useSelector((state) => state.imagesReducer);
  const options = [
    {label: "Image", value: "image", imageIcon: icons.image},
    {label: "Map", value: "map", imageIcon: icons.map},
  ];

  const deletedImages = () => {
    Alert.alert(
      "Are you sure?",
      "Are you sure you want to delete this image",
      [
        {
          text: "Yes",
          onPress: () => {
            database.query(`SELECT id, path FROM captures WHERE id IN (${selectedImages})`, (_, result) => {
              result.rows._array.map((file) => {
                FileSystem.deleteAsync(file.path).then(() => {
                  database.query(`DELETE FROM captures WHERE id = ${file.id}`, () => {
                    database.query(`SELECT * FROM captures WHERE sequence_uuid = '${sequence_uuid}'`, (_, result) => {
                      dispatch({type: SEQUENCE_IMAGES, payload: result.rows._array});
                      dispatch({type: UPDATE_SELECTED_IMAGES, payload: selectedImages.filter((e) => e !== file.id)});
                    })
                  })
                })
              })
            })
          }
        },
        {
          text: "No",
        }
      ]
    )
  }

  return (
    <View style={{flex: 1}}>
    <ScrollView>
      <View style={userSequenceStyles.tabBar}>
        <SwitchSelector
          initial={0}
          options={options}
          onPress={value => setActive(value)}
          backgroundColor={'#F5F5F5'}
          borderColor={'#CBD1D9'}
          buttonColor={'#32425B'}
          borderRadius={5}
          textColor={'#32425B'}
          hasPadding
          imageStyle={{width: 18, height: 18, marginRight: 3}}
          height={32}
        />

      </View>
      {active === 'image' && <ImageUpload navigation={navigation} sequence_uuid={sequence_uuid}/>}
    </ScrollView>
        {
          !!selectedImages.length &&
            <View style={userUploadStyles.deleteButton}>
              <TouchableOpacity onPress={() => deletedImages()}>
                <Trash width={24} height={24} />
              </TouchableOpacity>
            </View>
        }
    </View>
  );
};

export default UserSequence;

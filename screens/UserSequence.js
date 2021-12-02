import React, {useState} from "react";
import {ScrollView, View} from "react-native";
import Map from "../assets/svg/illustrations/Map";
import {ImageUpload} from "../components/Uploads";
import {userSequenceStyles} from "../styles/userSequenceStyle";
import SwitchSelector from "react-native-switch-selector";

const UserSequence = ({navigation}) => {

  const [active, setActive] = useState('image');
  const icons = {
    image: require("../assets/images/imgIcon.png"),
    map: require("../assets/images/mapIcon.png"),
  }

  const options = [
    {label: "Image", value: "image", imageIcon: icons.image},
    {label: "Map", value: "map", imageIcon: icons.map},
  ];

  return (
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
      {active === 'image' && <ImageUpload navigation={navigation} /> }
    </ScrollView>
  );
};

export default UserSequence;

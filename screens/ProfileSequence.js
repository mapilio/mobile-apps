import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import Map from "../assets/svg/illustrations/Map";
import ListProfileUploads from "../components/ListProfileUploads";
import { useDispatch } from "react-redux";
import { UPDATE_CURRENT_SEQUENCE } from "../store/actionsName";

const UserSequence = ({ navigation, route }) => {
  const [active, setActive] = useState("image");
  const dispatch = useDispatch();
  const icons = {
    image: require("../assets/images/imgIcon.png"),
    map: require("../assets/images/mapIcon.png"),
  };

  const options = [
    { label: "Image", value: "image", imageIcon: icons.image },
    { label: "Map", value: "map", imageIcon: icons.map },
  ];

  useEffect(() => {
    let unsubscribe = navigation.addListener("focus", () => {
      dispatch({
        type: UPDATE_CURRENT_SEQUENCE,
        payload: {
          sequence_uuid: route.params.id,
          user_id: route.params.user_id,
        },
      });
    });
    return unsubscribe;
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {/* <View style={userSequenceStyles.tabBar}>
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
                </View> */}
        {active === "image" && (
          <ListProfileUploads
            navigation={navigation}
            sequence_uuid={route.params.id}
            user_id={route.params.user_id}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default UserSequence;

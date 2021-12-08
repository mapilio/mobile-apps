import React, { useState } from "react";
import { View, Image, Dimensions } from "react-native";
import { CustomText } from "../highordercomponents";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { walkthroughStyle } from "../styles/walkthroughStyle";
import {
  Next,
  Prev,
  Start,
} from "../components/Walkthrough/CaptureWalkthrough";
import { useSelector } from "react-redux";
import { RFValue } from "react-native-responsive-fontsize";

const width = Dimensions.get("window").width;

const _renderItem = ({ item, i }) => {
  return (
    <View key={i} style={walkthroughStyle.image}>
      <Image
        source={item.src}
        style={{ width: item.width, height: item.height }}
        resizeMode={"contain"}
      />
      <CustomText style={walkthroughStyle.title}>{item.title}</CustomText>
      <CustomText style={walkthroughStyle.desc}>{item.desc}</CustomText>
    </View>
  );
};

const Walkthrough = () => {
  const { captureType } = useSelector((state) => state.cameraReducer);
  const [modalVisible, setModalVisible] = useState(true);
  const [active, setActive] = useState(0);
  const data = [
    {
      src: require("../assets/images/manuel_1.png"),
      width: 78,
      height: 76,
      title: "Manual Shooting",
      desc: "View panoramic locations, objects, facades and intersections with manual shooting mode.",
      mode: "manuel",
    },
    {
      src: require("../assets/images/manuel_2.png"),
      width: 94,
      height: 86,
      title: "Take more shots",
      desc: "Save as many images as possible.",
      mode: "manuel",
    },
    {
      src: require("../assets/images/auto_3.png"),
      width: 199,
      height: 25,
      title: "Camera Direction",
      desc: "Adjust the position of the camera to record the image parallel to the ground.",
      mode: "manuel",
    },
    {
      src: require("../assets/images/auto_1.png"),
      width: 74,
      height: 93,
      title: "Focus the Road",
      desc: "Set the focus as the path by touching the screen.",
      mode: "automatic",
    },
    {
      src: require("../assets/images/auto_2.png"),
      width: 78,
      height: 83,
      title: "Clean Image",
      desc: "Make sure that the vehicle hood and other objects are not visible in the image.",
      mode: "automatic",
    },
    {
      src: require("../assets/images/auto_3.png"),
      width: 199,
      height: 25,
      title: "Camera Direction",
      desc: "Adjust the position of the camera to record the image parallel to the ground.",
      mode: "automatic",
    },
  ].filter((e) => e.mode === captureType);

  return (
    <View style={{ ...walkthroughStyle.centeredView }}>
      <View style={walkthroughStyle.modalView}>
        <Carousel
          ref={(c) => {
            this._carousel = c;
          }}
          data={data}
          sliderWidth={width}
          itemWidth={width}
          renderItem={_renderItem}
          onSnapToItem={(index) => setActive(index)}
        />

        <View style={walkthroughStyle.pagination}>
          <Prev active={active} />
          <Pagination
            dotsLength={data.length}
            activeDotIndex={active}
            dotStyle={walkthroughStyle.dotStyle}
            inactiveDotStyle={walkthroughStyle.inactiveDotStyle}
            inactiveDotScale={1}
          />
          <Next active={active} dataLength={data.length} />
          <Start
            active={active}
            dataLength={data.length}
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          />
        </View>
      </View>
    </View>
  );
};

export default Walkthrough;

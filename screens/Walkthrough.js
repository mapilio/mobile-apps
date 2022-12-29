import React, {useState, useRef, useEffect} from "react";
import {View, Dimensions} from "react-native";
import {CustomText} from "../highordercomponents";
import Carousel, {Pagination} from "react-native-snap-carousel";
import {walkthroughStyle} from "../styles/walkthroughStyle";
import {Next, Prev, Start} from "../components/Walkthrough/CaptureWalkthrough";
import {useDispatch} from "react-redux";
import {CleanRoad, Orientation, Road} from "../assets/svg/illustrations";
import {IS_ACTIVE} from "../store/actionsName";
import {RFValue} from "react-native-responsive-fontsize";

const width = Dimensions.get("window").width;

const _renderItem = ({ item, i }) => {
  return (
    <View key={i} style={walkthroughStyle.image}>
      {item.src}
      <CustomText style={walkthroughStyle.title}>{item.title}</CustomText>
      <CustomText style={walkthroughStyle.desc}>{item.desc}</CustomText>
    </View>
  );
};

const Walkthrough = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const carouselRef = useRef();
  const dispatch = useDispatch();
  const [active, setActive] = useState(0);
  const data = [
    {
      src: <Road/>,
      width: RFValue(74),
      height: RFValue(93),
      title: "Focus the Road",
      desc: "Set the focus as the path by touching the screen.",
      mode: false,
    },
    {
      src: <CleanRoad/>,
      width: RFValue(78),
      height: RFValue(83),
      title: "Clean Image",
      desc: "Make sure that the vehicle hood and other objects are not visible in the image.",
      mode: false,
    },
    {
      src: <Orientation/>,
      width: RFValue(199),
      height: RFValue(25),
      title: "Camera Direction",
      desc: "Adjust the position of the camera to record the image parallel to the ground.",
      mode: false,
    },
  ];

  useEffect(() => {
    dispatch({type: IS_ACTIVE, payload: false})

    return () => {
      dispatch({type: IS_ACTIVE, payload: true})
    }
  }, []);

  return (
    <View style={walkthroughStyle.centeredView}>
      <View style={walkthroughStyle.modalView}>
        <Carousel
          ref={carouselRef}
          data={data}
          sliderWidth={width}
          itemWidth={width}
          renderItem={_renderItem}
          removeClippedSubviews={false}
          onSnapToItem={(index) => setActive(index)}
        />
        <View style={walkthroughStyle.pagination}>
          <Prev
            active={active}
            onPress={() => carouselRef.current?.snapToPrev()}
          />
          <Pagination
            dotsLength={data.length}
            activeDotIndex={active}
            dotStyle={walkthroughStyle.dotStyle}
            inactiveDotStyle={walkthroughStyle.inactiveDotStyle}
            inactiveDotScale={1}
          />
          <Next
            active={active}
            dataLength={data.length}
            onPress={() => carouselRef.current?.snapToNext()}
          />
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

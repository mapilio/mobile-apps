import React, { useEffect, useState } from "react";
import { Dimensions, View, Image } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { StreetLevel, UploadCapture } from "../assets/svg/illustrations";
import {
  Next,
  Prev,
  Start,
} from "../components/Walkthrough/WelcomeWalkthrough";
import { UPDATE_WELCOME_WALKTHROUGH_STATUS } from "../store/actionsName";
import { RFValue } from "react-native-responsive-fontsize";
import { CustomText, CustomTextBold } from "../highordercomponents";
import { useDispatch, useSelector } from "react-redux";
import { Routes } from "../navigator/Routes";

const WelcomeWalkthrough = ({ navigation }) => {
  const width = Dimensions.get("window").width;
  const [modalVisible, setModalVisible] = useState(true);
  const [active, setActive] = useState(0);
  const [data] = useState([
    {
      svg: <StreetLevel />,
      title: "Take a shot",
      subTitle: "At street level",
      desc: "Capture images with your smartphone, action camera, or 360 camera.",
    },
    {
      svg: <UploadCapture />,
      title: "Upload Captures",
      subTitle: "Contribute",
      desc: "Upload the images you took to the mapilio system.",
    },
    {
      svg: false,
      png: require("../assets/images/EarnGifts.jpg"),
      title: "Earn gifts",
      subTitle: "Complete missions",
      desc: "Get a chance to win gifts through the tasks you contribute.",
    },
  ]);
  const dispatch = useDispatch();
  const { welcomeWalkthroughStatus } = useSelector(
    (state) => state.generalReducer
  );

  useEffect(() => {
    if (welcomeWalkthroughStatus) {
      navigation.navigate(Routes.nonUserTab);
    } else {
      console.log(22);
      dispatch({ type: UPDATE_WELCOME_WALKTHROUGH_STATUS, payload: true });
    }
  }, []);

  const _renderItem = ({ item, i }) => (
    <View
      style={{
        justifyContent: "center",
        marginTop: "auto",
        marginBottom: "auto",
        textAlign: "center",
        alignItems: "center",
      }}
    >
      {item.svg ? (
        item.svg
      ) : (
        <Image
          source={item.png}
          style={{ width: RFValue(306), height: RFValue(271) }}
        />
      )}
      <View
        style={{
          paddingHorizontal: RFValue(45),
          marginTop: RFValue(45),
        }}
      >
        <CustomTextBold
          style={{
            fontSize: RFValue(16),
            color: "#B9C0CF",
            marginBottom: RFValue(3),
          }}
        >
          {item.subTitle}
        </CustomTextBold>
        <CustomTextBold
          style={{
            marginBottom: RFValue(5),
            fontSize: RFValue(34),
            color: "#213348",
          }}
        >
          {item.title}
        </CustomTextBold>
        <CustomText
          style={{ fontSize: RFValue(14), color: "#4A4A4A" }}
          lineCount={10}
        >
          {item.desc}
        </CustomText>
      </View>
    </View>
  );

  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        width: "100%",
        height: "100%",
        alignItems: "center",
      }}
    >
      <Carousel
        ref={(c) => {
          this._carousel = c;
        }}
        data={data}
        sliderWidth={width}
        style={{
          height: "100%",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
        itemWidth={width}
        renderItem={_renderItem}
        onSnapToItem={(index) => setActive(index)}
      />
      <View
        style={{
          alignSelf: "flex-start",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-between",
          marginLeft: RFValue(30),
          marginBottom: RFValue(20),
        }}
      >
        {/* <Prev active={active} /> */}
        <Pagination
          dotsLength={data.length}
          activeDotIndex={active}
          dotStyle={{
            height: RFValue(4),
            width: RFValue(27),
            backgroundColor: "#1976D2",
          }}
          inactiveDotStyle={{
            width: RFValue(17),
          }}
          inactiveDotScale={1}
        />
        <Next
          active={active}
          dataLength={data.length}
          setModalVisible={setModalVisible}
          navigation={navigation}
        />
        <Start
          active={active}
          dataLength={data.length}
          modalVisible={modalVisible}
        />
      </View>
    </View>
  );
};

export default WelcomeWalkthrough;

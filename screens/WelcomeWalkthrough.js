import React, {useState} from "react";
import {Dimensions, View, Image} from "react-native";
import Carousel, {Pagination} from "react-native-snap-carousel";
import {StreetLevel, UploadCapture} from "../assets/svg/illustrations";
import {Next, Start} from "../components/Walkthrough/WelcomeWalkthrough";
import {RFValue} from "react-native-responsive-fontsize";
import {CustomText, CustomTextBold} from "../highordercomponents";
import {useTranslation} from "react-i18next";

const WelcomeWalkthrough = () => {
  const {t} = useTranslation("welcome_walkthrough");
  const width = Dimensions.get("window").width;
  const [modalVisible, setModalVisible] = useState(true);
  const [active, setActive] = useState(0);
  const [data] = useState([
    {
      svg: <StreetLevel />,
      title: t("first.title"),
      subTitle: t("first.subtitle"),
      desc: t("first.description"),
    },
    {
      svg: <UploadCapture />,
      title: t("second.title"),
      subTitle: t("second.subtitle"),
      desc: t("second.description"),
    },
    {
      svg: false,
      png: require("../assets/images/EarnGifts.jpg"),
      title: t("third.title"),
      subTitle: t("third.subtitle"),
      desc: t("third.description"),
    },
  ]);

  const _renderItem = ({ item }) => (
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
            color: "#130C47",
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
        <Pagination
          dotsLength={data.length}
          activeDotIndex={active}
          dotStyle={{
            height: RFValue(4),
            width: RFValue(27),
            backgroundColor: "#1976D2",
          }}
          inactiveDotStyle={{width: RFValue(17),}}
          inactiveDotScale={1}
        />
        <Next
          active={active}
          dataLength={data.length}
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

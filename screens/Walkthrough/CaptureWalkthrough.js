import React, {useState, useRef, useEffect} from "react";
import {View} from "react-native";
import {CustomText} from "../../highordercomponents";
import PagerView from "react-native-pager-view";
import {walkthroughStyle} from "../../styles/walkthroughStyle";
import {Next, Prev, Start} from "../../components/Walkthrough/CaptureWalkthrough";
import {useDispatch} from "react-redux";
import {CleanRoad, Orientation, Road} from "../../assets/svg/illustrations";
import {IS_ACTIVE} from "../../store/actionsName";
import {RFValue} from "react-native-responsive-fontsize";
import {useTranslation} from "react-i18next";

const _renderItem = ({ item, i }) => {
  return (
    <View key={i} style={walkthroughStyle.image}>
      {item.src}
      <CustomText style={walkthroughStyle.title}>{item.title}</CustomText>
      <CustomText style={walkthroughStyle.desc}>{item.desc}</CustomText>
    </View>
  );
};

const CaptureWalkthrough = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const {t} = useTranslation("camera_walkthrough");
  const pagerRef = useRef();
  const dispatch = useDispatch();
  const [active, setActive] = useState(0);
  const data = [
    {
      src: <Road/>,
      width: RFValue(74),
      height: RFValue(93),
      title: t("first.title"),
      desc: t("first.description"),
      mode: false,
    },
    {
      src: <CleanRoad/>,
      width: RFValue(78),
      height: RFValue(83),
      title: t("second.title"),
      desc: t("second.description"),
      mode: false,
    },
    {
      src: <Orientation/>,
      width: RFValue(199),
      height: RFValue(25),
      title: t("third.title"),
      desc: t("third.description"),
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
        <PagerView
          ref={pagerRef}
          style={{flex: 1}}
          initialPage={0}
          onPageSelected={(e) => setActive(e.nativeEvent.position)}>
          {data.map((item, i) => _renderItem({ item, i }))}
        </PagerView>
        <View style={walkthroughStyle.pagination}>
          <Prev
            active={active}
            onPress={() => pagerRef.current?.setPage(active - 1)}
            desc={t("prev")}
          />
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            {data.map((_, i) => (
              <View
                key={i}
                style={i === active ? walkthroughStyle.dotStyle : walkthroughStyle.inactiveDotStyle}
              />
            ))}
          </View>
          <Next
            active={active}
            dataLength={data.length}
            onPress={() => pagerRef.current?.setPage(active + 1)}
            desc={t("next")}
          />
          <Start
            active={active}
            dataLength={data.length}
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            desc={t("finish")}
          />
        </View>
      </View>
    </View>
  );
};

export default CaptureWalkthrough;

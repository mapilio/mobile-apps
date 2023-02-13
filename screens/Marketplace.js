import React, {useEffect, useRef, useState} from "react";
import {TouchableOpacity, View} from "react-native";
import SlidingUpPanel from "rn-sliding-up-panel";
import {RFValue} from "react-native-responsive-fontsize";
import {List, MarketplaceMap} from "../components/Marketplace";
import {fetchHandler, getContentAreaHeight} from "../helper/helper";
import { useDispatch } from "react-redux";
import { MARKETPLACE_DATA } from "../store/actionsName";
import Config from "react-native-config";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {CustomText} from "../highordercomponents";
import {Document} from "../assets/svg/illustrations";
import FocusAwareStatusBar from "../components/FocusAwareStatusBar";
import {useTranslation} from "react-i18next";
import { useSelector } from "react-redux";
import Geolocation from "@react-native-community/geolocation";

const Marketplace = ({ navigation }) => {
  const {t} = useTranslation("marketplace");
  const slidePanel = useRef();
  const dispatch = useDispatch();
  const {top, bottom} = useSafeAreaInsets();
  const [onScroll, setOnScroll] = useState(false);
  const [currentCoordinate, setCurrentCoordinate] = useState({latitude: 0, longitude: 0});

  const {isInitialized} = useSelector(state => state.tooltipReducer.marketplace);


  const DEFAULT_FRICTION = isInitialized ? 0.998 : 0;

  useEffect(() => {
    Geolocation.getCurrentPosition(({coords: {latitude, longitude}}) => {
      setCurrentCoordinate({latitude: latitude, longitude: longitude})
    })
  }, []);

  useEffect(() => {
    let url = `${Config.SERVICE_URL}/api/get-marketplaces`
    const {latitude, longitude} = currentCoordinate;

    if (latitude !== 0 && longitude !== 0) {
      url += `?lat=${latitude}&lon=${longitude}`
    }

    fetchHandler({url: url}).then(({data: {geojson}}) => {
      dispatch({type: MARKETPLACE_DATA, payload: JSON.parse(geojson)});
    }).catch(({response: {data: {message}}}) => {
      toast.show(`${message}`, {type: "error"})
    });

  }, [currentCoordinate]);

  useEffect(() => {
    if(!isInitialized) {
      slidePanel.current?.show(RFValue(400))
    }
  }, [isInitialized]);


  return (
    <View style={{flex: 1, backgroundColor:"white"}}>
      <MarketplaceMap navigation={navigation}/>
      <FocusAwareStatusBar barStyle="dark-content"  backgroundColor={"transparent"}
        translucent={true} />
      <TouchableOpacity
        onPress={() => slidePanel.current?.show(RFValue(400))}
        style={{
        display:"flex",
        backgroundColor: '#130C47',
        marginTop: "auto",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: RFValue(24),
        height: RFValue(36),
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: RFValue(18),
        borderRadius: RFValue(18),
        flexDirection: "row",
      }}>
        <Document/>
        <View style={{width: RFValue(3)}}/>
        <CustomText style={{color: '#FFF'}}>{t("market_list")}</CustomText>
      </TouchableOpacity>

      <SlidingUpPanel
        allowDragging={!onScroll}
        showBackdrop={false}
        ref={slidePanel}
        friction={DEFAULT_FRICTION}
        draggableRange={{top: getContentAreaHeight(top, bottom) - top, bottom: 0}}
        containerStyle={{zIndex: 6}}
      >
        <List
          navigation={navigation}
          setOnScroll={setOnScroll}
          slidePanel={slidePanel.current}
        />
      </SlidingUpPanel>
    </View>
  );
};

export default Marketplace;

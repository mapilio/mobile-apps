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
import Geolocation from "react-native-geolocation-service";

const Marketplace = ({ navigation }) => {
  const dispatch = useDispatch();
  const [onScroll, setOnScroll] = useState(false);
  const slidePanel = useRef();
  const {top, bottom} = useSafeAreaInsets();
  const [currentCoordinate, setCurrentCoordinate] = useState({latitude: 0, longitude: 0});

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


  return (
    <View style={{flex: 1}}>
      <MarketplaceMap navigation={navigation}/>

      <TouchableOpacity
        onPress={() => slidePanel.current?.show(RFValue(400))}
        style={{
        backgroundColor: '#130C47',
        marginTop: "auto",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: RFValue(36),
        height: RFValue(36),
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: RFValue(24),
        borderRadius: RFValue(18),
        flexDirection: "row",
      }}>
        <Document/>
        <CustomText style={{color: '#FFF'}}>Market List</CustomText>
      </TouchableOpacity>

      <SlidingUpPanel
        allowDragging={!onScroll}
        showBackdrop={false}
        ref={slidePanel}
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

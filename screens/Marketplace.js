import React, {useEffect, useState} from "react";
import {View, Dimensions, ToastAndroid} from "react-native";
import SlidingUpPanel from "rn-sliding-up-panel";
import {RFValue} from "react-native-responsive-fontsize";
import {List} from "../components/Marketplace";
import MapboxGL from "@react-native-mapbox-gl/maps";
import {appMapStyle} from "../styles/appMapStyle";
import {fetchHandler} from "../helper/helper";
import {useDispatch, useSelector} from "react-redux";
import {MARKETPLACE_DATA} from "../store/actionsName";
import {MarketplaceIcon} from "../assets/svg/illustrations";

const {height} = Dimensions.get('window')

const Marketplace = ({navigation}) => {
  const dispatch = useDispatch();
  const {marketplaceData} = useSelector((status) => status.generalReducer)
  console.log(marketplaceData)
  useEffect(() => {
    fetchHandler({
      url: `${process.env.API_URL}/api/get-marketplaces`,
      method: "POST",
    }).then((res) => {
      dispatch({ type: MARKETPLACE_DATA, payload: JSON.parse(res.data.geojson)});
    }).catch((err) => {
      ToastAndroid.show(err.response.data.message, ToastAndroid.SHORT);
    });
  }, []);

  return (
    <View style={{flex: 1}}>
          <MapboxGL.MapView
            styleURL={'mapbox://styles/mapbox/light-v10'}
            style={appMapStyle.map}
            attributionPosition={{bottom: 41, right: 28}}
          >
            <MapboxGL.ShapeSource id={"test"} shape={marketplaceData} images={<MarketplaceIcon />} cluster={false} >
              <MapboxGL.SymbolLayer id={"testLayer"} style={{iconImage: require("../assets/images/marketplaceMarker.png"), iconSize: .5}}/>
            </MapboxGL.ShapeSource>
          </MapboxGL.MapView>

      <SlidingUpPanel
        draggableRange={{top: height - RFValue(150), bottom: RFValue(60)}}
        showBackdrop={false}
        containerStyle={{paddingBottom: RFValue(110)}}
      >
        <List navigation={navigation} projects={marketplaceData} />
      </SlidingUpPanel>
    </View>
  );
};

export default Marketplace;

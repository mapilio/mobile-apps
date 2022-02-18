import React, { useEffect, useState } from "react";
import { Dimensions, ToastAndroid, View } from "react-native";
import SlidingUpPanel from "rn-sliding-up-panel";
import { RFValue } from "react-native-responsive-fontsize";
import { List } from "../components/Marketplace";
import MapboxGL from "@react-native-mapbox-gl/maps";
import { appMapStyle } from "../styles/appMapStyle";
import { fetchHandler } from "../helper/helper";
import { useDispatch, useSelector } from "react-redux";
import { MARKETPLACE_DATA } from "../store/actionsName";
import { Routes } from "../navigator/Routes";
import { SERVICE_URL } from "@env";
import { useHeaderHeight } from "@react-navigation/elements";
const { height } = Dimensions.get("window");
import { MapView } from "../highordercomponents";

const Marketplace = ({ navigation }) => {
  const headerHeight = useHeaderHeight();
  const dispatch = useDispatch();
  const [onScroll, setOnScroll] = useState(false);
  const { marketplaceData } = useSelector((status) => status.generalReducer);

  useEffect(() => {
    fetchHandler({
      url: `${SERVICE_URL}/api/get-marketplaces`,
      method: "POST",
    })
      .then((res) => {
        dispatch({
          type: MARKETPLACE_DATA,
          payload: JSON.parse(res.data.geojson),
        });
      })
      .catch((err) => {
        ToastAndroid.show(err.response.data.message, ToastAndroid.SHORT);
      });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        mapStyle={appMapStyle.map}
        attributionStyle={{ bottom: 41, right: 28 }}
      >
        <MapboxGL.Camera centerCoordinate={[30.8, 41.015137]} zoomLevel={6} />
        {!!Object.keys(marketplaceData).length && (
          <MapboxGL.ShapeSource
            id={"marketplaceShape"}
            shape={marketplaceData}
            onPress={(project) => {
              navigation.navigate(Routes.marketplaceDetail, {
                data: project.features[0].properties,
              });
            }}
          >
            <MapboxGL.SymbolLayer
              id={"marketplaceSymbol"}
              style={{
                iconImage: require("../assets/images/marketplaceMarker.png"),
                iconSize: 0.2,
              }}
            />
          </MapboxGL.ShapeSource>
        )}
      </MapView>

      <SlidingUpPanel
        draggableRange={{
          top: height - headerHeight - 80,
          bottom: RFValue(60),
        }}
        allowDragging={!onScroll}
        showBackdrop={false}
        containerStyle={{
          marginBottom:
            Platform.OS === "android"
              ? RFValue(63)
              : Dimensions.get("window").height > 775
              ? RFValue(83)
              : RFValue(63),
          zIndex: 6,
        }}
      >
        <List
          navigation={navigation}
          projects={marketplaceData}
          setOnScroll={setOnScroll}
        />
      </SlidingUpPanel>
    </View>
  );
};

export default Marketplace;

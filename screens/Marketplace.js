import React, {useEffect, useState} from "react";
import {Dimensions, Platform, View} from "react-native";
import SlidingUpPanel from "rn-sliding-up-panel";
import { RFValue } from "react-native-responsive-fontsize";
import {List, MarketplaceMap} from "../components/Marketplace";
import { fetchHandler } from "../helper/helper";
import { useDispatch } from "react-redux";
import { MARKETPLACE_DATA } from "../store/actionsName";
import { useHeaderHeight } from "@react-navigation/elements";
const { height } = Dimensions.get("window");
import {toastMessage} from "../helper/alerts";
import {centerCoordinatesByPolygons} from "../helper/geojson";
import Config from "react-native-config";

const Marketplace = ({ navigation }) => {
  const headerHeight = useHeaderHeight();
  const dispatch = useDispatch();
  const [onScroll, setOnScroll] = useState(false);
  const [centeredCoordinates, setCenteredCoordinates] = useState({})
  const [slidePanel, setSlidePanel] = useState();

  useEffect(() => {
    fetchHandler({
      url: `${Config.SERVICE_URL}/api/get-marketplaces`,
      method: "POST",
    }).then((res) => {
      setCenteredCoordinates(centerCoordinatesByPolygons(JSON.parse(res.data.geojson)))
      dispatch({type: MARKETPLACE_DATA, payload: JSON.parse(res.data.geojson)});
    }).catch((err) => {
      toastMessage.error(err.response.data.message)
    });
  }, []);

  return (
    <View style={{flex: 1}}>
      <MarketplaceMap
        centeredPoints={centeredCoordinates}
        navigation={navigation}
      />

      <SlidingUpPanel
        allowDragging={!onScroll}
        showBackdrop={false}
        ref={c => setSlidePanel(c)}
        draggableRange={{
          top: height - headerHeight *  2,
          bottom: RFValue(60),
        }}
        containerStyle={{
          marginBottom: Platform.OS !== "android" && Dimensions.get("window").height > 775 ? RFValue(83) : RFValue(63),
          zIndex: 6,
        }}
      >
        <List
          setOnScroll={setOnScroll}
          slidePanel={slidePanel}
        />
      </SlidingUpPanel>
    </View>
  );
};

export default Marketplace;

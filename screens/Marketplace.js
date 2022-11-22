import React, {useEffect, useState} from "react";
import {TouchableOpacity, View} from "react-native";
import SlidingUpPanel from "rn-sliding-up-panel";
import {RFValue} from "react-native-responsive-fontsize";
import {List, MarketplaceMap} from "../components/Marketplace";
import {fetchHandler, getContentAreaHeight} from "../helper/helper";
import { useDispatch } from "react-redux";
import { MARKETPLACE_DATA } from "../store/actionsName";
import {toastMessage} from "../helper/alerts";
import Config from "react-native-config";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {CustomText} from "../highordercomponents";
import {Document} from "../assets/svg/illustrations";

const Marketplace = ({ navigation }) => {
  const dispatch = useDispatch();
  const [onScroll, setOnScroll] = useState(false);
  const [slidePanel, setSlidePanel] = useState();
  const [toggleSlidePanel, setToggleSlidePanel] = useState(true);
  const {top, bottom} = useSafeAreaInsets();

  useEffect(() => {
    fetchHandler({url: `${Config.SERVICE_URL}/api/get-marketplaces`}).then(({data: {geojson}}) => {
      dispatch({type: MARKETPLACE_DATA, payload: JSON.parse(geojson)});
    }).catch(({response: {data: {message}}}) => {
      toastMessage.error(message)
    });
  }, []);

  return (
    <View style={{flex: 1}}>
      <MarketplaceMap navigation={navigation}/>

      <TouchableOpacity
        onPress={() => setToggleSlidePanel(prev => !prev)}
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
        ref={c => setSlidePanel(c)}
        draggableRange={{top: getContentAreaHeight(top, bottom) - top, bottom: bottom + RFValue(50)}}
        containerStyle={{display: toggleSlidePanel ? 'none' : 'flex', zIndex: 6}}
      >
        <List
          navigation={navigation}
          setOnScroll={setOnScroll}
          slidePanel={slidePanel}
          setToggleSlidePanel={setToggleSlidePanel}
        />
      </SlidingUpPanel>
    </View>
  );
};

export default Marketplace;

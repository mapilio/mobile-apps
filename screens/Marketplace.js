import React, {useEffect} from "react";
import {Dimensions, ToastAndroid, View} from "react-native";
import SlidingUpPanel from "rn-sliding-up-panel";
import {RFValue} from "react-native-responsive-fontsize";
import {List} from "../components/Marketplace";
import MapboxGL from "@react-native-mapbox-gl/maps";
import {appMapStyle} from "../styles/appMapStyle";
import {fetchHandler} from "../helper/helper";
import {useDispatch, useSelector} from "react-redux";
import {MARKETPLACE_DATA} from "../store/actionsName";
import {Routes} from "../navigator/Routes";

const {height} = Dimensions.get('window')

const Marketplace = ({navigation}) => {
    const dispatch = useDispatch();
    const {marketplaceData} = useSelector((status) => status.generalReducer)
    useEffect(() => {
        fetchHandler({
            url: `${process.env.SERVICE_URL}/api/get-marketplaces`,
            method: "POST",
        }).then((res) => {
            dispatch({type: MARKETPLACE_DATA, payload: JSON.parse(res.data.geojson)});
        }).catch((err) => {
            ToastAndroid.show(err.response.data.message, ToastAndroid.SHORT);
        });
    }, []);

    return (<View style={{flex: 1}}>
            <MapboxGL.MapView
                styleURL={'mapbox://styles/mapbox/light-v10'}
                style={appMapStyle.map}
                attributionPosition={{bottom: 41, right: 28}}
            >
                <MapboxGL.Camera centerCoordinate={[30.8, 41.015137]} zoomLevel={6}/>
                {
                    !!Object.keys(marketplaceData).length && (
                        <MapboxGL.ShapeSource
                            id={"marketplaceShape"}
                            shape={marketplaceData}
                            onPress={(project) => {
                                navigation.navigate(Routes.marketplaceDetail, {data: project.features[0].properties})
                            }}
                        >
                            <MapboxGL.SymbolLayer
                                id={"marketplaceSymbol"}
                                style={{iconImage: require("../assets/images/marketplaceMarker.png"), iconSize: .2}}
                            />
                        </MapboxGL.ShapeSource>
                    )
                }
            </MapboxGL.MapView>

            <SlidingUpPanel
                draggableRange={{top: height - (height / 2), bottom: RFValue(160)}}
                showBackdrop={false}
                containerStyle={{paddingBottom: RFValue(310)}}
            >
                <List navigation={navigation} projects={marketplaceData}/>
            </SlidingUpPanel>
        </View>
    );
};
export default Marketplace;

import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import MapLibreGL from "@maplibre/maplibre-react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { api } from "../../util/helpers/api";
import Config from "react-native-config";
import { CustomText, CustomTextBold, MapView } from "../../highordercomponents";
import { RFValue } from "react-native-responsive-fontsize";
import { dateConvert } from "../../helper/helper";
import { setGeoJson } from "../../helper/geojson";
import { styles as mapStyles } from "../../styles/circleStyles";
import { bbox } from "@turf/turf";
import { ArrowLeft } from "../../assets/svg/illustrations";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import ActiveImage from "../../components/UserFeed/ActiveImage";

const UserFeedDetails = ({ route }) => {
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  const { id, user_id, start_address, capture_time } = route.params;
  const [mapData, setMapData] = useState({
    sequenceData: [],
    points: {},
    lines: {},
    bbox: [],
  });

  const [activeImage, setActiveImage] = useState(null);
  const bottomSheetRef = useRef(null);

  const getData = async () => {
    await api
      .get(
        `/api/user-uploads-detail-v2?options[parameters][user_id]=${user_id}&options[parameters][group_key]=${id}&options[limit]=1000&page=1`
      )
      .then((res) => {
        setMapData({
          sequenceData: res.data,
          points: setGeoJson(res.data, "point"),
          lines: setGeoJson(res.data, "line"),
          bbox: bbox(setGeoJson(res.data, "line")),
        });
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const snapPoints = useMemo(() => {
    return activeImage ? ["40%"] : ["40%", "80%"];
  }, [activeImage]);

  const handleBack = () => {
    if (activeImage) {
      setActiveImage(null);
    } else {
      navigation.goBack();
    }
  };

  const BackButton = () => {
    return (
      <TouchableOpacity
        style={{
          ...styles.base,
          top: top + RFValue(20),
        }}
        onPress={handleBack}
      >
        <ArrowLeft width={RFValue(20)} height={RFValue(20)} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <BackButton />
      <MapView style={{ flex: 1 }} isAttributionsEnabled={false} pitchEnabled={false}>
        {mapData.bbox?.length > 0 && (
          <Fragment>
            <MapLibreGL.Camera
              bounds={{
                ne: [mapData?.bbox[2], mapData?.bbox[3]],
                sw: [mapData?.bbox[0], mapData?.bbox[1]],
                paddingTop: 100,
                paddingBottom: 300,
                paddingLeft: 100,
                paddingRight: 100,
              }}
              animationMode={"flyTo"}
              animationDuration={1000}
            />

            <MapLibreGL.ShapeSource id={"LineShape"} shape={mapData?.lines}>
              <MapLibreGL.LineLayer
                id="lineLayer"
                style={mapStyles.lineStyles}
              />
            </MapLibreGL.ShapeSource>
            <MapLibreGL.ShapeSource
              id={"PointShape"}
              shape={mapData?.points}
              onPress={(e) => {
                setActiveImage({
                  img_code: e.features[0].properties.item.img_code,
                  filename: e.features[0].properties.item.filename,
                });
              }}
            >
              <MapLibreGL.CircleLayer
                id="pointLayer"
                style={mapStyles.circles}
              />
            </MapLibreGL.ShapeSource>
          </Fragment>
        )}
      </MapView>


      <BottomSheet snapPoints={snapPoints} index={0} ref={bottomSheetRef}
        handleStyle={{display:"none"}}
      >
        {activeImage && (
          <ActiveImage
            imgCode={activeImage.img_code}
            filename={activeImage.filename}
            captureDate={capture_time}
            sequenceName={start_address}
          />
        )}

        <View style={{ zIndex:2, height:RFValue(20) }}>
          <View style={styles.indicator} />
        </View>


        <View style={styles.listWrapper}>
          <CustomTextBold style={{ color: "#333333", fontSize: RFValue(16) }}>
            {start_address ? start_address : "No Adress"}
          </CustomTextBold>
          <CustomText style={{ color: "#666666", fontSize: RFValue(12) }}>
            {capture_time
              ? dateConvert(capture_time, "MMM DD, YYYY - HH:mm")
              : "No Time"}
          </CustomText>
          <BottomSheetFlatList
            data={mapData.sequenceData}
            numColumns={3}
            keyExtractor={(item) => item.id}
            style={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => {
                  bottomSheetRef.current.snapToIndex(0);
                  setActiveImage({
                    img_code: item.img_code,
                    filename: item.filename,
                  });
                }}
              >
                <Image
                  source={{
                    uri: `${Config.IMAGE_API}/${item.img_code}/${item.filename}`,
                  }}
                  style={styles.listImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
          />
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    position: "absolute",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    padding: RFValue(8),
    borderRadius: RFValue(20),
    left: 20,
    zIndex: 2,
  },
  activeImageWrapper: {
    height: "100%",
    width: "100%",
    position: "absolute",
    zIndex: 100,
    backgroundColor: "#fff",
  },
  listWrapper: {
    paddingTop: RFValue(10),
    paddingLeft: RFValue(10),
    flex: 1,
  },
  listContent: {
    flex: 1,
    marginTop: RFValue(10),
    paddingRight: RFValue(10),
  },
  listItem: {
    flex: 1,
    height: RFValue(75),
    margin: RFValue(2),
  },
  listImage: {
    height: "100%",
    width: "auto",
    borderRadius: RFValue(5),
  },
  indicator: {
    width: RFValue(40),
    height: RFValue(3),
    backgroundColor: "#ccc",
    borderRadius: RFValue(5),
    alignSelf: "center",
    marginTop: RFValue(10),
  },
});
export default UserFeedDetails;

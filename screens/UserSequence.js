import {useEffect, useMemo, useRef, useState} from "react";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {MapView} from "../highordercomponents";
import {ArrowLeft} from "../assets/svg/illustrations";
import {globalStyles} from "../styles/globalStyles";
import MapLibreGL from "@maplibre/maplibre-react-native";
import {useDispatch, useSelector} from "react-redux";
import db from "../db";
import {bbox, lineString} from "@turf/turf";
import BottomSheet from '@gorhom/bottom-sheet';
import UserSequenceDetail from "./UserSequenceDetail";
import {Heading} from "../components/Map";
import {setGeoJson} from "../helper/geojson";
import {UPDATE_SELECTED_IMAGES, UPLOAD_DATA} from "../store/actionsName";
import SequenceDetail from "../components/SequenceDetail";
import {Routes} from "../navigator/Routes";
import {FocusAwareStatusBar, Loading, } from "../components";
import {MapLoading} from "../components/Map"

const UserSequence = ({navigation}) => {
  const cameraRef = useRef();
  const {top} = useSafeAreaInsets();
  const {uploadData} = useSelector((state) => state.uploadReducer);
  const {activeSequence} = useSelector((state) => state.uploadReducer);
  const [mapGeoJson, setMapGeoJson] = useState(null);
  const [imageDetail, setImageDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const bottomSheetModalRef = useRef(null);
  const dispatch = useDispatch();
  const [isMapLoading, setIsMapLoading] = useState(true);


  useEffect(() => {
    getData()
  }, [uploadData]);

  useEffect(() => {
    if(imageDetail){
      cameraRef.current.setCamera({
        centerCoordinate: [JSON.parse(imageDetail.location).longitude, JSON.parse(imageDetail.location).latitude],
        animationDuration: 300,
      });
    }
  }, [imageDetail]);


  const GetContent = () => {
    if (loading) {
      return (<Loading />);
    }

    if (!!imageDetail) {
      return <UserSequenceDetail item={imageDetail} changeImage={changeImage} deleteHandler={deleteImages} />
    }

    if (!!mapGeoJson) {
      return <SequenceDetail sequence={mapGeoJson?.result} onClick={(imageData)=>{
        bottomSheetModalRef.current?.snapToIndex(0);
        setImageDetail(imageData);
      }} deleteHandler={deleteImages}/>
    }

    return null;
  }


  const snapPoints = useMemo(() => {
   return (imageDetail || loading) ? ['40%'] : ["40%", "80%"]
  }, [imageDetail, loading]);

  const getData = async () => {

    try {
      const result = await db.getCaptures(activeSequence);

      const splitSequences = result.reduce((acc, item) => {
        const sequence_uuid = item.sequence_uuid;
        if (acc[sequence_uuid]) {
          acc[sequence_uuid].push(item);
        } else {
          acc[sequence_uuid] = [item];
        }
        return acc;
      }, {});
      
      const lines = Object.keys(splitSequences).reduce((acc, key) => {
        acc[key] = lineString(splitSequences[key].map(({location}) => [JSON.parse(location).longitude, JSON.parse(location).latitude]));
        return acc;
      }, {});

      const coordinates = result.map(({location}) => [JSON.parse(location).longitude, JSON.parse(location).latitude]);

      const point = setGeoJson(result, 'point');
      const line = lineString(coordinates);
      const bboxData = bbox(line);


      setMapGeoJson({lines, point, bboxData, result});
      setTimeout(() => {
        setLoading(false);
      }, 300);
    } catch {
      db.getGroupByWithGroupID().then((data) => {
        dispatch({type: UPLOAD_DATA, payload: data})
        navigation.navigate(Routes.upload)
      })
    }
  }

  const goBack = () => {
    if (!!imageDetail) {
      setImageDetail(undefined);
    } else {
      navigation.goBack();
    }
  }

  /**
   * Change image detail to next or previous image in sequence detail list view (bottom sheet)
   * @param {string ?: "next" | "prev"} type next or previous image type string
   */
  const changeImage = (type) => {
    const index = mapGeoJson?.result.findIndex(({id}) => id === imageDetail?.id);
    const newIndex = type === 'next' ? index + 1 : index - 1;

    if (newIndex < 0 || newIndex > mapGeoJson?.result.length - 1) {
      setImageDetail(undefined);
    } else {
      const total = mapGeoJson?.result.length;
      const current = newIndex + 1;

      setImageDetail({...mapGeoJson?.result[newIndex], total, current});
    }
  }

  /**
   * Delete images from local storage and database and update state to reflect changes in UI
   * @param images array of image ids to delete from local storage and database
   * @returns {Promise<void>}
   */
  const deleteImages = async (images) => {
    changeImage('next');
    await db.deleteCapturesByIds(images)

    dispatch({type: UPDATE_SELECTED_IMAGES, payload: []});

    getData()
  }

  const onPointClick = (e) => {
    if (e.features.length > 1) {
      const coordinates = e.features.map(({geometry: {coordinates}}) => coordinates);
      const clickedBbox = bbox(lineString(coordinates || []));

      cameraRef.current?.fitBounds([clickedBbox[0], clickedBbox[1]], [clickedBbox[2], clickedBbox[3]], [20, 20], 500);

    } else {
      bottomSheetModalRef.current?.snapToIndex(0);
      const item = e.features[0].properties.item;
      item.total = mapGeoJson?.result.length;
      item.current = mapGeoJson?.result.findIndex(({id}) => id === item?.id) + 1;

      setImageDetail(e.features[0].properties.item);
    }
  }


  return (
    <View style={styles.container}>
      <FocusAwareStatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <TouchableOpacity
        onPress={goBack}
        style={{ ...styles.backButton, top: top + RFValue(20) }}
      >
        <ArrowLeft width={RFValue(18)} height={RFValue(18)} />
      </TouchableOpacity>
      {isMapLoading && <MapLoading />}
      {mapGeoJson && (
        <MapView
          style={{ height: "100%" }}
          pitchEnabled={false}
          onDidFinishLoadingMap={() => {
            setTimeout(() => {
              setIsMapLoading(false);
            }, 300);
          }}
        >
          <MapLibreGL.Camera
            bounds={{
              ne: [mapGeoJson?.bboxData[2], mapGeoJson?.bboxData[3]],
              sw: [mapGeoJson?.bboxData[0], mapGeoJson?.bboxData[1]],
              paddingTop: 100,
              paddingBottom: 300,
              paddingLeft: 100,
              paddingRight: 100,
            }}
            ref={cameraRef}
            animationDuration={0}
          />

          {Object.keys(mapGeoJson?.lines).map((key, index) => {
            return (
              <MapLibreGL.ShapeSource
                id={key}
                key={index}
                shape={mapGeoJson?.lines[key]}
              >
                <MapLibreGL.LineLayer id={key} style={styles.lineStyles} />
              </MapLibreGL.ShapeSource>
            );
          })}

          <MapLibreGL.ShapeSource
            id={"PointShape"}
            shape={mapGeoJson?.point}
            onPress={onPointClick}
          >
            <MapLibreGL.CircleLayer
              id="pointLayer"
              style={styles.circleStyles}
            />
          </MapLibreGL.ShapeSource>
          {imageDetail && (
            <Heading
              coordinates={[
                JSON.parse(imageDetail.location).longitude,
                JSON.parse(imageDetail.location).latitude,
              ]}
              heading={JSON.parse(imageDetail?.location).heading}
              markerPath={require("../assets/images/heading.png")}
            />
          )}
        </MapView>
      )}

      <BottomSheet
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        index={0}
        handleIndicatorStyle={{
          ...styles.indicatorStyle,
          backgroundColor: imageDetail ? "#FFF" : "#D8D8D8",
        }}
        handleStyle={styles.handleStyle}
        style={{ backgroundColor: "transparent" }}
        containerStyle={{ zIndex: 2 }}
      >
        <GetContent />
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    left: RFValue(20),
    zIndex: 1,
    padding:RFValue(8),
    borderRadius: RFValue(34),
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    ...globalStyles.shadow,
  },
  lineStyles: {
    lineColor: "#0056F1",
    lineWidth: 2,
  },
  circleStyles: {
    circleColor: "#0056F1",
    circleRadius: 5,
    circleStrokeOpacity: .5,
    circleStrokeWidth: 2.5,
    circleStrokeColor: "#0056F1",
  },
  currentCircle: {
    circleColor: "red",
    circleRadius: 10,
    circleStrokeOpacity: .5,
    circleStrokeWidth: 2.5,
    circleStrokeColor: "#0056F1",
  },
  handleStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  indicatorStyle: {
    width: RFValue(37),
    height: RFValue(4),
    borderRadius: RFValue(2),
  },
})

export default UserSequence;

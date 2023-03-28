import React, {useEffect, useMemo, useRef, useState} from "react";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {MapView} from "../highordercomponents";
import {ArrowLeft} from "../assets/svg/illustrations";
import {globalStyles} from "../styles/globalStyles";
import MapboxGL from "@rnmapbox/maps";
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
import {FocusAwareStatusBar, Loading} from "../components";


const UserSequence = ({navigation}) => {
  const cameraRef = useRef();
  const {top} = useSafeAreaInsets();
  const {uploadData} = useSelector((state) => state.uploadReducer);
  const {activeSequence} = useSelector((state) => state.uploadReducer);
  const [mapGeoJson, setMapGeoJson] = useState(undefined);
  const [imageDetail, setImageDetail] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const bottomSheetModalRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    getData().then(() => setLoading(false));
  }, [])

  useEffect(() => {
    getData().then(() => setLoading(false));
  }, [uploadData])

  const GetContent = () => {
    if (loading) {
      return <Loading />
    }

    if (!!imageDetail) {
      return <UserSequenceDetail item={imageDetail} changeImage={changeImage} deleteHandler={deleteImages} />
    }

    if (!!mapGeoJson) {
      return <SequenceDetail sequence={mapGeoJson?.result} onClick={setImageDetail} deleteHandler={deleteImages}/>
    }

    return null;
  }

  const snapPoints = useMemo(() => [...Array(9).keys()].map((e) => (e + 1) + '0%'), []);

  const getData = async () => {
    setLoading(true);
    try {
      const result = await db.getCaptures(activeSequence);

      const coordinates = result.map(({location}) => [JSON.parse(location).longitude, JSON.parse(location).latitude]);

      const point = setGeoJson(result, 'point');
      const line = lineString(coordinates);
      const bboxData = bbox(line);


      setMapGeoJson({line, point, bboxData, result});
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
    setImageDetail(undefined);

    await db.deleteCapturesByIds(images)

    dispatch({type: UPDATE_SELECTED_IMAGES, payload: []});

    await getData();
  }

  const onPointClick = (e) => {
    if (e.features.length > 1) {
      const coordinates = e.features.map(({geometry: {coordinates}}) => coordinates);
      const clickedBbox = bbox(lineString(coordinates || []));

      cameraRef.current?.fitBounds([clickedBbox[0], clickedBbox[1]], [clickedBbox[2], clickedBbox[3]], [20, 20], 500);

    } else {
      const item = e.features[0].properties.item;
      item.total = mapGeoJson?.result.length;
      item.current = mapGeoJson?.result.findIndex(({id}) => id === item?.id) + 1;

      setImageDetail(e.features[0].properties.item);
    }
  }

  return (
    <View style={styles.container}>

      <TouchableOpacity
        onPress={goBack}
        style={{...styles.backButton, top: top + RFValue(20)}}
      >
       <ArrowLeft width={RFValue(17)} height={RFValue(30)} />
      </TouchableOpacity>

      <FocusAwareStatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      <MapView style={{flex: 1}} pitchEnabled={false}>
        <MapboxGL.Camera
          ref={cameraRef}
          bounds={{
            ne: [mapGeoJson?.bboxData[2], mapGeoJson?.bboxData[3]],
            sw: [mapGeoJson?.bboxData[0], mapGeoJson?.bboxData[1]],
            paddingTop: 100, paddingBottom: 100, paddingLeft: 100, paddingRight: 100,
          }}
          animationDuration={0}
        />

        <MapboxGL.ShapeSource id={"LineShape"} shape={mapGeoJson?.line}>
          <MapboxGL.LineLayer id="lineLayer" style={styles.lineStyles}/>
        </MapboxGL.ShapeSource>

        <MapboxGL.ShapeSource id={"PointShape"} shape={mapGeoJson?.point} onPress={onPointClick}>
          <MapboxGL.CircleLayer id="pointLayer" style={styles.circleStyles} />
        </MapboxGL.ShapeSource>

        {
          !!imageDetail && (
            <Heading
              coordinates={[JSON.parse(imageDetail.location).longitude, JSON.parse(imageDetail.location).latitude]}
              heading={JSON.parse(imageDetail?.location).heading}
              markerPath={require("../assets/images/heading.png")}
            />
          )
        }
      </MapView>

      <BottomSheet
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        index={2}
        handleIndicatorStyle={{...styles.indicatorStyle, backgroundColor: imageDetail ? "#FFF" : "#D8D8D8"}}
        handleStyle={styles.handleStyle}
        style={{backgroundColor: 'transparent'}}
        containerStyle={{zIndex:2}}
      >
        <GetContent/>
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
    width: RFValue(34),
    height: RFValue(34),
    paddingLeft: RFValue(3),
    borderRadius: RFValue(34),
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    ...globalStyles.shadow,
  },
  lineStyles: {
    lineColor: "#3F8BE9",
    lineWidth: 2,
  },
  circleStyles: {
    circleColor: "#3F8BE9",
    circleRadius: 5,
    circleStrokeOpacity: .5,
    circleStrokeWidth: 2.5,
    circleStrokeColor: "#3F8BE9",
  },
  currentCircle: {
    circleColor: "red",
    circleRadius: 10,
    circleStrokeOpacity: .5,
    circleStrokeWidth: 2.5,
    circleStrokeColor: "#3F8BE9",
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

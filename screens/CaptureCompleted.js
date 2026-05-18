import {ActivityIndicator, Dimensions, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Trans, useTranslation} from "react-i18next";
import React, {Fragment, useEffect, useRef, useState} from "react";
import {RFPercentage, RFValue} from "react-native-responsive-fontsize";
import {MapView} from "../highordercomponents";
import {Photos, TimeIcon} from "../assets/svg/illustrations";
import {useSelector} from "react-redux";
import db from "../db";
import {dateConvert} from "../helper/helper";
import {lineString, bbox, length, points} from "@turf/turf";
import MapLibreGL from "@maplibre/maplibre-react-native";
import Loading from "../components/Loading";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Routes} from "../navigator/Routes";
import {useNavigation} from "@react-navigation/native";
import {Upload} from "../components/Uploads";
import { FocusAwareStatusBar } from "../components";
import * as RNFS from '../util/fs';

const CaptureCompleted = () => {
  const [totalSize, setTotalSize] = useState(0);
  const [lineDetail, setLineDetail] = useState(null);
  const [minute, setMinute] = useState(0);
  const [mapLoading, setMapLoading] = useState(true);
  const {t} = useTranslation("capture_completed");
  const {groupId} = useSelector((state) => state.cameraReducer);
  const {top, bottom} = useSafeAreaInsets();
  const navigation = useNavigation();
  const cameraRef = useRef();

  /**
   * @description Calculate the capture time
   * @returns {Promise<number>} return Minutes
   */
  const calculateTime = async () => {
    const firstData = await db.getFirstWithGroupID(groupId);
    const lastData = await db.getLastWithGroupID(groupId);

    const exif1 = JSON.parse(firstData.exif)
    const exif2 = JSON.parse(lastData.exif)

    const firstTime = new Date(dateConvert(exif1.DateTime || exif1.DateTimeOriginal || exif1.DateTimeDigitized || exif1["{TIFF}"].DateTime, 'MMM D, YYYY HH:mm:ss'));
    const lastTime = new Date(dateConvert(exif2.DateTime || exif2.DateTimeOriginal || exif2.DateTimeDigitized || exif2["{TIFF}"].DateTime, 'MMM D, YYYY HH:mm:ss'));

    const diffTime = Math.abs(lastTime - firstTime);

    return (diffTime / (1000 * 60)).toFixed(2)
  }

  const checkData = async () => {
    const data = await db.getCapturesByGroupID(groupId)

    if (data.length <= 5) {
      skipHandler()
      return;
    }

    const line = lineString(data.map((item) => [JSON.parse(item.location).longitude, JSON.parse(item.location).latitude]))
    const point = points(data.map((item) => [JSON.parse(item.location).longitude, JSON.parse(item.location).latitude]))

    const bboxData = bbox(line)
    const lengthData = length(line, {units: 'kilometers'})
    const count = data.length
    const { default_storage_path } = data[0]

    let path = RNFS.DocumentDirectoryPath
    if (default_storage_path === 'external') {
      const dirs = await RNFS.getAllExternalFilesDirs()
      path = dirs[1]
    }

    const {size} = await RNFS.stat(path + `/${groupId}`)
    setTotalSize(Math.round(size / 1024 / 1024))

    setLineDetail({line, point, bboxData, lengthData, count, data})

    calculateTime().then((time) => setMinute(time))
  }

  useEffect(() => {
    navigation.getParent().setOptions({tabBarStyle: {display: "none"}});
    checkData()

    return () => navigation.getParent().setOptions({tabBarStyle: {display: "flex", height: RFValue(63) + bottom}});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bottom, navigation]);

  const skipHandler = () => {
    navigation.popTo(Routes.upload)
  }

  const MapLoader = () => <View style={{...styles.map, ...styles.mapLoader}}><ActivityIndicator size={"large"}/></View>

  if (!lineDetail) {
    return <Loading />
  }

  return (
    <View style={{...styles.container, marginTop: top}}>
      <FocusAwareStatusBar barStyle="dark-content" translucent backgroundColor="#fff" />
      <Text style={styles.title}>
        <Trans
          t={t}
          i18nKey={"title"}
          components={[<Text style={styles.bold}/>]}
          values={{"distance": lineDetail.lengthData.toFixed(2)}}
        />
      </Text>

      <View style={{marginVertical: RFValue(15)}}>
        {mapLoading && <MapLoader/>}

        <MapView
          mapStyle={styles.map}
          scrollEnabled={false}
          zoomEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
          onDidFinishLoadingMap={() => setMapLoading(false)}
        >
          <MapLibreGL.Camera
            zoomLevel={10}
            ref={cameraRef}
            animationDuration={0}
            bounds={{
              ne: [lineDetail.bboxData[0] || 0, lineDetail.bboxData[1] || 0],
              sw: [lineDetail.bboxData[2] || 0, lineDetail.bboxData[3] || 0],
              paddingTop: 25, paddingBottom: 25, paddingLeft: 25, paddingRight: 25,
            }}
          />

          <MapLibreGL.ShapeSource id={"capturedShape"} shape={lineDetail.line}>
            <MapLibreGL.LineLayer id="capturedLine" style={styles.line}/>
          </MapLibreGL.ShapeSource>

          <MapLibreGL.ShapeSource id={"capturedPoint"} shape={lineDetail.point}>
            <MapLibreGL.CircleLayer id="capturedCircle" style={styles.point}/>
          </MapLibreGL.ShapeSource>

        </MapView>
      </View>



      <Text style={styles.date}>
        {
          dateConvert(
            JSON.parse(lineDetail.data[0].exif).DateTime
            || JSON.parse(lineDetail.data[0].exif).DateTimeOriginal
            || JSON.parse(lineDetail.data[0].exif).DateTimeDigitized
            || JSON.parse(lineDetail.data[0].exif)["{TIFF}"].DateTime,
            "MMM DD, YYYY - HH:mm"
          )
        }
      </Text>
      <View style={styles.detail}>
        <Fragment>
          <Text style={styles.detail.text}>
            <Photos height={RFValue(16)} width={RFValue(16)}/>
            {" "}
            <Trans
              t={t}
              i18nKey={"detail"}
              components={[<Text style={styles.medium}/>]}
              values={{"count": lineDetail.count, "size": totalSize}}
            />
          </Text>
        </Fragment>

        <View style={styles.detail.time}>
          <TimeIcon />
          <Text style={styles.detail.time.text}>
            {minute} {t("minute")}
          </Text>
        </View>
      </View>


      <View style={{marginTop: 'auto', marginBottom: bottom ? bottom : RFValue(30)}}>
        <Upload group_uuid={groupId} />

        <TouchableOpacity style={styles.skipButton} onPress={skipHandler}>
          <Text style={styles.skip}>{t("upload_later")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: RFValue(20),
    paddingTop: RFValue(20),
    backgroundColor:"#fff"
  },
  title: {
    fontSize: RFValue(20),
    fontFamily: 'Poppins-Medium',
    color: '#191919',
  },
  bold: {
    fontFamily: 'Poppins-SemiBold',
  },
  medium: {
    fontFamily: 'Poppins-Medium',
  },
  map: {
    borderColor: '#D8D8D8',
    borderWidth: 1,
    height: Dimensions.get('window').height * 0.4,
    overflow: 'hidden',
    borderRadius: RFValue(10),
  },
  mapLoader: {
    position: 'absolute',
    zIndex: 9,
    width: '100%',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  date: {
    fontSize: RFValue(18),
    fontFamily: 'Poppins-Medium',
    color: '#130C47',
  },
  detail: {
    marginTop: RFValue(5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    text: {
      fontSize: RFValue(16),
      fontFamily: 'Poppins-Medium',
      color: '#808080',
    },

    time: {
      flexDirection: 'row',

      text: {
        color: '#C2C2C2',
        fontSize: RFValue(16),
        alignItems: 'center',
        paddingLeft: RFValue(3)
      }
    }
  },
  skipButton:{
    paddingHorizontal: RFValue(15),
    borderRadius: RFPercentage(50),
    marginBottom: RFValue(5),
  },
  skip: {
    textAlign: 'center',
    paddingVertical: RFValue(13),
    color: '#191919',
    fontFamily: 'Poppins-Medium',
    fontSize: RFValue(14),
    borderWidth: 1,
    borderColor: '#C2C2C2',
    borderRadius: RFValue(24),
  },
  line: {
    lineColor: "#0056F1",
    lineWidth: 2,
  },
  point: {
    circleColor: "#0056F1",
    circleStrokeColor: "#0056F1",
    circleStrokeOpacity: 0.4,
    circleStrokeWidth: 3,
  }
})


export default CaptureCompleted;

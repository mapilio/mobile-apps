import React, {useState} from "react";
import {Modal, View, Image, Dimensions} from "react-native";
import {CustomText} from "../../highordercomponents";
import * as ScreenOrientation from 'expo-screen-orientation';
import Carousel, {Pagination} from "react-native-snap-carousel";
import {walkthogherStyle} from "../../styles/walkthogherStyle";
import {Next, Prev, Start} from "./Buttons";


const width = Dimensions.get('window').width;

const _renderItem = ({item, i}) => {
  return (
    <View key={i} style={walkthogherStyle.image}>
      <Image
        source={item.src}
        style={{width: item.width, height: item.height}}
        resizeMode={"contain"}
      />
      <CustomText style={walkthogherStyle.title}>
        {item.title}
      </CustomText>
      <CustomText style={walkthogherStyle.desc}>
        {item.desc}
      </CustomText>
    </View>
  );
};


const Walkthougher = ({mode}) => {
  const [modalVisible, setModalVisible] = useState(true);
  const [active, setActive] = useState(0);
  const data = [
    {
      src: require("../../assets/images/manuel_1.png"),
      width: 78,
      height: 76,
      title: 'Manual Shooting',
      desc: 'View panoramic locations, objects, facades and intersections with manual shooting mode.',
      mode: 'manual'
    },
    {
      src: require("../../assets/images/manuel_2.png"),
      width: 94,
      height: 86,
      title: 'Take more shots',
      desc: 'Save as many images as possible.',
      mode: 'manual'
    },
    {
      src: require("../../assets/images/auto_3.png"),
      width: 199,
      height: 25,
      title: 'Camera Direction',
      desc: 'Adjust the position of the camera to record the image parallel to the ground.',
      mode: 'manual'
    },
    {
      src: require("../../assets/images/auto_1.png"),
      width: 74,
      height: 93,
      title: 'Focus the Road',
      desc: 'Set the focus as the path by touching the screen.',
      mode: 'automatic'
    },
    {
      src: require("../../assets/images/auto_2.png"),
      width: 78,
      height: 83,
      title: 'Clean Image',
      desc: 'Make sure that the vehicle hood and other objects are not visible in the image.',
      mode: 'automatic'
    },
    {
      src: require("../../assets/images/auto_3.png"),
      width: 199,
      height: 25,
      title: 'Camera Direction',
      desc: 'Adjust the position of the camera to record the image parallel to the ground.',
      mode: 'automatic'
    },

  ].filter(e => e.mode === mode)

  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
    >
      <View style={{...walkthogherStyle.centeredView}}>
        <View style={walkthogherStyle.modalView}>
          <Carousel
            ref={(c) => {
              this._carousel = c;
            }}
            data={data}
            sliderWidth={width}
            itemWidth={width}
            renderItem={_renderItem}
            onSnapToItem={(index) => setActive(index)}
          />

          <View style={walkthogherStyle.pagination}>
            <Prev active={active}/>
            <Pagination
              dotsLength={data.length}
              activeDotIndex={active}
              dotStyle={walkthogherStyle.dotStyle}
              inactiveDotStyle={walkthogherStyle.inactiveDotStyle}
              inactiveDotScale={1}
            />
            <Next active={active} dataLength={data.length}/>
            <Start active={active} dataLength={data.length} modalVisible={modalVisible}
                   setModalVisible={setModalVisible}/>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Walkthougher;

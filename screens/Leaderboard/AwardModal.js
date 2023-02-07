import {StyleSheet, TouchableOpacity, View} from "react-native";
import SlidingUpPanel from "rn-sliding-up-panel";
import {getContentAreaHeight} from "../../helper/helper";
import React, {Fragment, useEffect, useRef, useState} from "react";
import Award from "../Award";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {RFValue} from "react-native-responsive-fontsize";
import {CloseIcon} from "../../assets/svg/illustrations";
import {useDispatch, useSelector} from "react-redux";
import {SET_SHOW_GIFTS} from "../../store/actionsName";

const AwardModal = () => {
  const {showGifts} = useSelector(state => state.leaderboardReducer);
  const {top, bottom} = useSafeAreaInsets();
  const dispatch = useDispatch();
  const slidePanel = useRef(null);
  const [onScroll, setOnScroll] = useState(false);

  const closeHandler = () => slidePanel.current?.hide()

  useEffect(() => {
    if (showGifts) {
      slidePanel.current?.show()
      dispatch({type: SET_SHOW_GIFTS, payload: false})
    }
  }, []);

  return (
    <Fragment>
      <SlidingUpPanel
        ref={slidePanel}
        allowDragging={!onScroll}
        draggableRange={{top: getContentAreaHeight(top / 2, bottom) - top, bottom: 0}}
        containerStyle={styles.slideContainer}
      >
        <Fragment>
          <View style={styles.divider}/>

          <TouchableOpacity onPress={closeHandler} style={styles.closeIcon}>
            <CloseIcon/>
          </TouchableOpacity>
        </Fragment>

        <Award setOnScroll={setOnScroll}/>
      </SlidingUpPanel>
    </Fragment>
  )
}

const styles = StyleSheet.create({
  slideContainer: {
    zIndex: 6,
    backgroundColor: '#FFF',
    borderTopLeftRadius: RFValue(20),
    borderTopRightRadius: RFValue(20),
  },
  divider: {
    height: RFValue(5),
    width: RFValue(50),
    backgroundColor: '#D8D8D8',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: RFValue(5),
    marginTop: RFValue(12),
    marginBottom: RFValue(22),
  },
  closeIcon: {
    backgroundColor: '#D8D8D8',
    width: RFValue(25),
    height: RFValue(25),
    borderRadius: RFValue(25),
    position: 'absolute',
    right: RFValue(20),
    top: RFValue(20),
    alignItems: 'center',
    justifyContent: 'center',
  }
})

export default AwardModal;

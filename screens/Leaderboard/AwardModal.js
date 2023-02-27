import React, { useEffect, useRef, useMemo, useCallback } from "react";
import Award from "../Award";
import { useDispatch, useSelector } from "react-redux";
import { SET_SHOW_GIFTS } from "../../store/actionsName";
import { vibrate } from "../../util/helpers";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";

const AwardModal = () => {
  const { showGifts } = useSelector((state) => state.leaderboardReducer);
  const dispatch = useDispatch();
  const slidePanel = useRef(null);

  useEffect(() => {
    if (showGifts) {
      slidePanel.current?.present();
      vibrate("success");
      dispatch({ type: SET_SHOW_GIFTS, payload: false });
    }
  }, []);

  const snapPoints = useMemo(() => ["90%"], []);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.6}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={slidePanel}
      snapPoints={snapPoints}
      index={0}
      handleIndicatorStyle={{ backgroundColor: "#D8D8D8" }}
      backdropComponent={renderBackdrop}
    >
      <Award isModal />
    </BottomSheetModal>
  );
};

export default AwardModal;

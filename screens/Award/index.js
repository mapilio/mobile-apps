import { ScrollView } from "react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Content from "./Content";

const Award = ({ isModal = false }) => {
  if (isModal)
    return (
      <BottomSheetScrollView>
        <Content />
      </BottomSheetScrollView>
    );

  return (
    <ScrollView>
      <Content />
    </ScrollView>
  );
};

export default Award;

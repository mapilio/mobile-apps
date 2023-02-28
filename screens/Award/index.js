import { ScrollView } from "react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Content from "./Content";

const Award = ({ isModal = false, slidePanel }) => {
  if (isModal)
    return (
      <BottomSheetScrollView>
        <Content slidePanel={slidePanel} />
      </BottomSheetScrollView>
    );

  return (
    <ScrollView>
      <Content />
    </ScrollView>
  );
};

export default Award;

import React, { useState } from "react";
import { View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useSelector } from "react-redux";
import ProjectListModal from "./ProjectListModal";
import SelectedProject from "./SelectedProject";
import SelectProjectButton from "./SelectProjectButton";

const CameraProjectInfo = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const { selectedProject } = useSelector((state) => state.cameraReducer);

  return (
    <View
      style={{
        flex: 1,
        position: "absolute",
        marginVertical: RFValue(14),
        marginHorizontal: RFValue(20),
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        left: 0,
        right: 0,
        alignItems: "center",
      }}
    >
      <ProjectListModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
      {selectedProject.type === "individual" ? (
        <SelectProjectButton setModalVisible={setModalVisible} />
      ) : (
        <SelectedProject projectName={selectedProject.projectName} />
      )}
    </View>
  );
};

export default CameraProjectInfo;

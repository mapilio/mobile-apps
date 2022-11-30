import React, { useState } from "react";
import { View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useSelector } from "react-redux";
import ProjectListModal from "./ProjectListModal";
import SelectedProject from "./SelectedProject";
import SelectProjectButton from "./SelectProjectButton";

const CameraProjectInfo = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const {selectedProject, autoCaptureStart} = useSelector((state) => state.settingsReducer);

  return (
    <View
      style={{
        flex: 1,
        position: "absolute",
        marginVertical: RFValue(14),
        marginHorizontal: RFValue(20),
        justifyContent: "center",
        alignItems: "center",
        left: 0,
        top: 0,
        right: 0,
      }}
    >
      <ProjectListModal modalVisible={modalVisible} setModalVisible={setModalVisible} navigation={navigation}/>
      {selectedProject.type === "individual" ? (
        !autoCaptureStart ? (<SelectProjectButton setModalVisible={setModalVisible}/>) : null
      ) : (
        <SelectedProject projectName={selectedProject.projectName} />
      )}
    </View>
  );
};

export default CameraProjectInfo;

import React, { useState } from "react";
import { View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useSelector } from "react-redux";
import { tooltipContents } from "../util/consts/tooltip";
import ProjectListModal from "./ProjectListModal";
import SelectedProject from "./SelectedProject";
import SelectProjectButton from "./SelectProjectButton";
import { TooltipWrapper } from "./Tooltip";

const CameraProjectInfo = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const {selectedProject, autoCaptureStart} = useSelector((state) => state.settingsReducer);

  return (
    <View style={{
      position:"absolute",
      right: "45%",
      marginTop: RFValue(16),
    }}>
      <ProjectListModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
      {selectedProject.type === "individual" ? (
        !autoCaptureStart ? (<TooltipWrapper name={"tasks"} content={tooltipContents.camera.tasks} placement="bottom">
          <SelectProjectButton setModalVisible={setModalVisible}/>
        </TooltipWrapper>) : null
      ) : (
        <SelectedProject projectName={selectedProject.projectName} />
      )}
    </View>
  );
};

export default CameraProjectInfo;

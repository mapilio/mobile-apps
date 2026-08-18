import React from 'react';
import { Pressable, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { convertHexToRGBA, maxCharacterHandler } from '../helper/helper';
import { CustomText, CustomTextMedium } from '../highordercomponents';
import { useDispatch } from 'react-redux';
import { UPDATE_SELECTED_PROJECT } from '../store/actionsName';

const ProjectList = ({ project, setModalVisible }) => {
  const dispatch = useDispatch();

  const chooseHandler = () => {
    dispatch({
      type: UPDATE_SELECTED_PROJECT,
      payload: {
        type: 'project',
        projectName: project.project_detail.marketplace_name,
        projectKey: project.project_detail.project_key,
        organizationKey: project.project_detail.project_organization_key,
        id: project.project_key,
      },
    });
    setModalVisible(false);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: convertHexToRGBA('#CBD1D9', 20),
        padding: RFValue(10),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: RFValue(4),
        marginBottom: RFValue(6),
      }}
      id={project.projectKey}>
      <View style={{ flex: 0.9 }}>
        <CustomTextMedium style={{ fontSize: RFValue(14), color: '#130C47' }}>
          {maxCharacterHandler(project.project_detail.marketplace_name, 40)}
        </CustomTextMedium>
        <CustomText
          style={{
            fontSize: RFValue(12),
            color: convertHexToRGBA('#4B6583', 60),
          }}>
          {project.project_detail.marketplace_description}
        </CustomText>
      </View>
      <Pressable
        style={{
          backgroundColor: '#4A90E2',
          borderRadius: RFValue(4),
          justifyContent: 'center',
          alignItems: 'center',
          width: RFValue(70),
          height: RFValue(30),
        }}
        onPress={chooseHandler}>
        <CustomTextMedium style={{ fontSize: RFValue(12), color: '#FFFFFF' }}>
          Start
        </CustomTextMedium>
      </Pressable>
      {/* <Button
        color={"#4A90E2"}
        title={"Start"}
        accessibilityLabel={"Project start button"}
        style={{ borderRadius: RFValue(3) }}
      /> */}
    </View>
  );
};

export default ProjectList;

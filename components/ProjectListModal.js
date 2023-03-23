import React, {useEffect, useState} from "react";
import {
	ActivityIndicator, FlatList,
	Modal,
	Pressable,
	View,
} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";
import {CloseIcon} from "../assets/svg/illustrations";
import {CustomTextMedium} from "../highordercomponents";
import ProjectList from "./ProjectList";
import {cameraProjectModalStyles} from "../styles/cameraStyles";
import { Trans, useTranslation } from "react-i18next";
import * as ScreenOrientation from "expo-screen-orientation";
import {api} from "../util/helpers/api";
import { useNavigation } from "@react-navigation/native";

const ProjectListModal = ({modalVisible, setModalVisible}) => {
	const {t} = useTranslation("camera");
	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigation = useNavigation();

	useEffect(() => {
		api.get('/api/function/projects/job/getMyJobs').then((res) => {
			setLoading(false);
			setProjects(res.data);
		}).catch(() => {
			toast.show(`There was a problem fetching your jobs. Please try again.`, {type: "warning"})
		});
	}, []);

	const EmptyList = () => {
    const goMarketplace = () => {
      setModalVisible(false);
	  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
		navigation.reset({
			index: 0,
			routes: [
				{ name: "MarketplaceTab", },
			],
		});
	}

    return (
      <View style={{ flexDirection: "column", alignItems: "center" }}>
        <CustomTextMedium
          style={cameraProjectModalStyles.projectList.paragraph}
        >
          {t("empty_mission_title")}
        </CustomTextMedium>
        <CustomTextMedium style={cameraProjectModalStyles.projectList.paragraph}>
          <Trans
            t={t}
            i18nKey="empty_mission_description"
			components={[<CustomTextMedium style={cameraProjectModalStyles.projectList.link} onPress={goMarketplace} />]}
          />
        </CustomTextMedium>
      </View>
    );
  };

	return (
		<View style={cameraProjectModalStyles.projectList.outline}>
			<Modal animationType={"fade"} visible={modalVisible} transparent={true} supportedOrientations={["landscape"]}>
				<View style={cameraProjectModalStyles.projectList.modal}>
					<View style={cameraProjectModalStyles.projectList.content}>
						<Pressable style={cameraProjectModalStyles.projectList.close} onPress={() => setModalVisible(false)}>
							<CloseIcon color={"#4A4A4A"}/>
						</Pressable>
						<CustomTextMedium style={cameraProjectModalStyles.projectList.title}>
							{t("select_mission")}
						</CustomTextMedium>
						{loading ? (
							<View style={{marginVertical: RFValue(40)}}>
								<ActivityIndicator color={"#4A90E2"} size={"large"}/>
							</View>
						) : (
							<FlatList
								style={{width: '100%'}}
								data={projects}
								renderItem={({item}) => <ProjectList project={item} setModalVisible={setModalVisible}/>}
								ListEmptyComponent={() => <EmptyList/>}
							/>
						)}
					</View>
				</View>
			</Modal>
		</View>
	);
};

export default ProjectListModal;

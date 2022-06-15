import React, {useEffect, useState} from "react";
import {
	ActivityIndicator,
	Modal,
	Pressable,
	ScrollView,
	View,
} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";
import {CloseIcon} from "../assets/svg/illustrations";
import {CustomText, CustomTextMedium} from "../highordercomponents";
import ProjectList from "./ProjectList";
import {fetchHandler} from "../helper/helper";
import {Routes} from "../navigator/Routes";
import {SERVICE_URL} from "@env";
import {toastMessage} from "../helper/alerts";
import {cameraProjectModalStyles} from "../styles/cameraStyles";

const ProjectListModal = ({navigation, modalVisible, setModalVisible}) => {
	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchHandler({url: `${SERVICE_URL}/api/function/projects/job/getMyJobs`})
			.then((res) => {
				setLoading(false);
				setProjects(res.data);
			})
			.catch(() => {
				toastMessage.warning("There was a problem fetching your jobs. Please try again.")
			});
	}, []);

	return (
		<View style={cameraProjectModalStyles.projectList.outline}>
			<Modal animationType={"fade"} visible={modalVisible} transparent={true} supportedOrientations={["landscape"]}>
				<View style={cameraProjectModalStyles.projectList.modal}>
					<View style={cameraProjectModalStyles.projectList.content}>
						<Pressable style={cameraProjectModalStyles.projectList.close} onPress={() => setModalVisible(false)}>
							<CloseIcon color={"#E5E7EF"}/>
						</Pressable>
						<CustomTextMedium style={cameraProjectModalStyles.projectList.title}>
							Select mission
						</CustomTextMedium>
						<ScrollView style={{width: "100%"}}>
							{loading ? (
								<View style={{marginVertical: RFValue(40)}}>
									<ActivityIndicator color={"#4A90E2"} size={"large"}/>
								</View>
							) : projects ? (
								projects.map((item, index) => (
									<ProjectList key={index} project={item} setModalVisible={setModalVisible}/>
								))
							) : (
								<CustomText style={{flexDirection: "row"}}>
									<CustomTextMedium
										style={cameraProjectModalStyles.projectList.paragraph}
									>
										There is no project you are involved in. You can browse
										projects on{" "}
									</CustomTextMedium>
									<CustomTextMedium
										style={cameraProjectModalStyles.projectList.link}
										onPress={() => navigation.navigate(Routes.marketplace)}
									>
										Marketplace.
									</CustomTextMedium>
								</CustomText>
							)}
						</ScrollView>
					</View>
				</View>
			</Modal>
		</View>
	);
};

export default ProjectListModal;

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
import {fetchHandler} from "../helper/helper";
import {Routes} from "../navigator/Routes";
import {cameraProjectModalStyles} from "../styles/cameraStyles";
import Config from "react-native-config";

const ProjectListModal = ({navigation, modalVisible, setModalVisible}) => {
	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchHandler({url: `${Config.SERVICE_URL}/api/function/projects/job/getMyJobs`}).then((res) => {
			setLoading(false);
			setProjects(res.data);
		}).catch(() => {
			toast.show(`There was a problem fetching your jobs. Please try again.`, {type: "warning"})
		});
	}, []);


	const EmptyList = () => {

		const goMarketplace = () => {
			setModalVisible(false)
			navigation.reset({index: 0, routes: [{name: Routes.marketplace}]})
		}

		return (
			<View>
				<CustomTextMedium style={cameraProjectModalStyles.projectList.paragraph}>
					There is no project you are involved in. You can browse projects on{" "}
				</CustomTextMedium>
				<Pressable onPress={goMarketplace}>
					<CustomTextMedium style={cameraProjectModalStyles.projectList.link}>
						Marketplace.
					</CustomTextMedium>
				</Pressable>
			</View>
		)
	}

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

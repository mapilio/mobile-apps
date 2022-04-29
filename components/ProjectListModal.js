import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { CloseIcon } from "../assets/svg/illustrations";
import { CustomText, CustomTextMedium } from "../highordercomponents";
import ProjectList from "./ProjectList";
import { fetchHandler } from "../helper/helper";
import { Routes } from "../navigator/Routes";
import { SERVICE_URL } from "@env";
import {toastMessage} from "../helper/alerts";

const ProjectListModal = ({ navigation, modalVisible, setModalVisible }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHandler({ url: `${SERVICE_URL}/api/function/projects/job/getMyJobs` })
      .then((res) => {
        setLoading(false);
        setProjects(res.data);
      })
      .catch(() => {
        toastMessage.warning("There was a problem fetching your jobs. Please try again.")
      });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Modal
        animationType={"fade"}
        visible={modalVisible}
        transparent={true}
        supportedOrientations={["landscape"]}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginVertical: RFValue(20),
          }}
        >
          <View
            style={{
              margin: RFValue(20),
              backgroundColor: "white",
              borderRadius: RFValue(6),
              padding: RFValue(35),
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: RFValue(2),
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
              width: "90%",
            }}
          >
            <Pressable
              style={{
                position: "absolute",
                top: RFValue(15),
                right: RFValue(25),
                padding: RFValue(10),
              }}
              onPress={() => setModalVisible(false)}
            >
              <CloseIcon color={"#E5E7EF"} />
            </Pressable>
            <CustomTextMedium
              style={{
                color: "#4A4A4A",
                alignSelf: "flex-start",
                marginBottom: RFValue(10),
              }}
            >
              Select mission
            </CustomTextMedium>
            <ScrollView style={{ width: "100%" }}>
              {loading ? (
                <View style={{ marginVertical: RFValue(40) }}>
                  <ActivityIndicator color={"#4A90E2"} size={"large"} />
                </View>
              ) : projects ? (
                projects.map((item, index) => (
                  <ProjectList
                    key={index}
                    project={item}
                    setModalVisible={setModalVisible}
                  />
                ))
              ) : (
                <CustomText style={{ flexDirection: "row" }}>
                  <CustomTextMedium
                    style={{ fontSize: RFValue(14), color: "#4A4A4A" }}
                  >
                    There is no project you are involved in. You can browse
                    projects on{" "}
                  </CustomTextMedium>
                  <CustomTextMedium
                    style={{ color: "#4A90E2", fontSize: RFValue(14) }}
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

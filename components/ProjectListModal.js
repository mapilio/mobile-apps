import React from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { CloseIcon } from "../assets/svg/illustrations";
import { CustomTextMedium } from "../highordercomponents";
import ProjectList from "./ProjectList";

const ProjectListModal = ({ modalVisible, setModalVisible }) => {
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
        supportedOrientations={["landscape-right"]}
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
                  padding:RFValue(10)
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
              {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
                <ProjectList key={item} />
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProjectListModal;

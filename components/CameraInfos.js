import React from "react";
import { Dimensions, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { BadGPS, GoodGPS } from "../assets/svg/illustrations";
import { convertHexToRGBA } from "../helper/helper";
import {
  CustomText,
  CustomTextBold,
  CustomTextMedium,
} from "../highordercomponents";

const CameraInfos = () => {
  return (
    <View
      style={{
        flex: 1,
        marginVertical: RFValue(25),
        marginHorizontal: RFValue(20),
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
    >
      {/* <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          marginTop: RFValue(17),
          marginLeft: RFValue(23),
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <CustomText
          style={{
            color: "#FFFFFF",
            fontSize: RFValue(12),
            marginRight: RFValue(8),
            marginBottom: RFValue(-3),
          }}
        >
          98%
        </CustomText>
        <View
          style={{
            maxWidth: RFValue(48),
            width: RFValue(24),
            height: RFValue(10),
            borderWidth: RFValue(1),
            borderColor: convertHexToRGBA("#FFFFFF", 40),
            borderRadius: 2,
            position: "relative",
            cursor: "pointer",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: RFValue(20),
              background: "rgb(236, 39, 72)",
            }}
          >
            <View
              style={{
                width: "100%",
                backgroundColor: "#FFFFFF",
                height: RFValue(6),
              }}
            ></View>
          </View>
        </View>
      </View> */}
      {/* <View
        style={{
          position: "absolute",
          top: 0,
          marginTop: RFValue(17),
          right: 0,
          marginRight: RFValue(57),
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "#E24A4A",
            width: RFValue(12),
            height: RFValue(12),
            borderRadius:
              Math.round(
                Dimensions.get("window").width + Dimensions.get("window").height
              ) / 2,
            marginRight: RFValue(5),
            marginTop: RFValue(-2),
          }}
        ></View>
        <CustomTextMedium style={{ fontSize: RFValue(14), color: "#FFFFFF" }}>
          NO REC
        </CustomTextMedium>
      </View> */}
      {/* <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          marginVertical: RFValue(25),
          marginHorizontal: RFValue(20),
          flexDirection: "row",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            marginBottom: RFValue(39),
          }}
        >
          <CustomTextMedium
            style={{
              fontSize: RFValue(14),
              color: "#1AD971",
            }}
          >
            12
          </CustomTextMedium>
          <CustomTextMedium
            style={{
              color: "#FFFFFF",
              fontSize: RFValue(14),
              marginHorizontal: RFValue(3),
            }}
          >
            /
          </CustomTextMedium>
          <CustomTextMedium style={{ color: "#FFFFFF", fontSize: RFValue(14) }}>
            128
          </CustomTextMedium>
        </View>
      </View> */}
      {/* <View
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          marginVertical: RFValue(25),
          marginHorizontal: RFValue(22),
        }}
      >
        <View
          style={{
            marginBottom: RFValue(40),
            right: 0,
            marginRight: RFValue(40),
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <GoodGPS />
          <CustomTextMedium
            style={{
              color: "#FFFFFF",
              fontSize: RFValue(14),
              marginLeft: RFValue(5),
              marginBottom: RFValue(-2),
            }}
          >
            Good GPS
          </CustomTextMedium>
        </View>
      </View> */}
    </View>
  );
};

export default CameraInfos;

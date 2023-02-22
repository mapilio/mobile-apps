import { Platform, StyleSheet } from "react-native";
import {RFPercentage, RFValue} from "react-native-responsive-fontsize";
import { convertHexToRGBA } from "../helper/helper";

const colors = {
  completed: {color: '#1AD971', border: '#1AD97166'},
  uploaded: {color: '#3F8BE9', border: '#3F8BE966'},
  processing: {color: '#FFC01A', border: '#FFC01A66'},
  fail: {color: '#EC6A56', border: '#EC6A5666'},
}

export const userFeedStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFF',
    shadowColor: '#00000029',
    shadowOffset: {height: 0, width: 3},
    shadowOpacity: .9,
    shadowRadius: 2,
    elevation: 3,
    marginBottom: RFValue(10),
    borderWidth: .3,
    borderColor: '#00000029',
    borderRadius: 4,
  },
  imageWrapper: {height: RFValue(100)},
  imageStyle: {
    width: "100%",
    height: RFValue(100),
    resizeMode: "cover",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    zIndex: 8,
    position: "absolute",
    top: 0,
    left: 0,
  },
  imageGradient: {
    zIndex: 9,
    position: "absolute",
    height: RFValue(100),
    flex: 1,
    width: "100%"
  },
  info: {
    justifyContent: "space-between",
    padding: RFValue(10)
  },
  subInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  address:{
    color: "#191919",
    fontSize: RFValue(12),
    fontFamily: "Poppins-Medium",
  },
  date: {
    color: '#808080',
    fontSize: RFValue(10),
    fontFamily: "Poppins",
  },
  status: {
    position: "absolute",
    right: RFValue(10),
    top: RFValue(10),
    zIndex: 10,
    text: {
      fontSize: RFValue(10),
      fontFamily: 'Poppins',
    },
    uploaded: {color: colors.uploaded.color},
    completed: {color: colors.completed.color},
    processing: {color: colors.processing.color},
    fail: {color: colors.fail.color},
    icon: {
      borderRadius: RFPercentage(50),
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: "auto",
      marginBottom: "auto",
      width: RFValue(7),
      height: RFValue(7),

      border: {
        borderRadius: RFPercentage(50),
        width: RFValue(10),
        height: RFValue(10),
      },

      uploaded: {
        backgroundColor: colors.uploaded.color,
        border: {backgroundColor: colors.uploaded.border}
      },

      completed: {
        backgroundColor: colors.completed.color,
        border: {backgroundColor: colors.completed.border}
      },

      processing: {
        backgroundColor: colors.processing.color,
        border: {backgroundColor: colors.processing.border}
      },

      fail : {
        backgroundColor: colors.fail.color,
        border: {backgroundColor: colors.fail.border}
      }
    }
  }
});

export const userInfoStyles = StyleSheet.create({
  profileContainer: {
    flexDirection: "row",
  },
  imageStyle: {
    borderRadius: RFPercentage(50),
    borderWidth: RFValue(1),
    borderColor: '#EAEAEA',
    resizeMode: "cover",
    width: RFValue(81),
    height: RFValue(81),
    marginRight: RFValue(18),
    zIndex: 9,
  },
  indicatorStyle: {
    backgroundColor: "rgba(74,74,74,0.1)",
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
    top: 0,
    zIndex: 10,
  },
  username: {
    color: "#0056F1",
    fontSize: RFValue(18),
    fontFamily: "Poppins-Medium",
  },
  accountType: {
    color: "#4a4a4a",
    fontSize: RFValue(12),
    marginTop: Platform.OS === "android" ? RFValue(-4) : 0,
  },
  infoGrid: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  infoTitle: {
    fontSize: RFValue(12),
    color: "#C2C2C2",
  },
  infoValue: {
    fontSize: RFValue(18),
    color: "#191919",
  },
  infoContainer: {
    flex: .8,
    flexDirection: "column",
    marginRight: RFValue(10),
  },
  separator: {
    borderLeftWidth: 1,
    borderLeftColor: "#D8D8D8",
    height: "50%",
    marginBottom: 10,
  }
});

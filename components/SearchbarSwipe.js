import React, { useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import SwipeLine from "../assets/svg/illustrations/SwipeLine";
import { CustomText } from "../highordercomponents";
import { marketplaceStyles } from "../styles/marketplaceStyles";
import { RFValue } from "react-native-responsive-fontsize";
import {
  convertHexToRGBA,
  fetchHandler,
  maxCharacterHandler,
  toastGenerator,
} from "../helper/helper";
import SearchIcon from "../assets/svg/illustrations/SearchIcon";
import axios from "axios";
import { ActivityIndicator } from "react-native-paper";
import { SEARCH_API } from "@env";

const SearchbarSwipe = ({ setFly, panelRef }) => {
  const [value, setInputValue] = useState("");
  const [valueAPI, setAPIValue] = useState("");
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();
    setLoading(true);

    if (valueAPI.length !== 0) {
      fetchHandler({
        url: `${SEARCH_API}${valueAPI}`,
      })
        .then((res) => {
          setLocations(res.features);
          setLoading(false);
        })
        .catch((err) => {
          toastGenerator(
            "An error occurred while find locations, please try again.",
            require("../assets/images/Info.png"),
            errorAlertStyles.alertContainer,
            errorAlertStyles.alertTitle,
            errorAlertStyles.alertImage
          );
        });
    } else {
      setLoading(false);
      setLocations([]);
    }

    return () => {
      ourRequest.cancel();
    };
  }, [valueAPI]);

  const flyToCoordinate = (coord) => {
    setFly(coord);
    panelRef.current.show(80);
  };

  return (
    <View style={marketplaceStyles.container}>
      <View style={marketplaceStyles.panelHeader}>
        <SwipeLine />
      </View>
      <View>
        <TextInput
          placeholder={"Search for street, city, country..."}
          placeholderTextColor={convertHexToRGBA("#FFFFFF", 70)}
          value={value}
          onChangeText={(value) => {
            setInputValue(value);
            setLoading(true);
            setTimeout(() => {
              setAPIValue(value);
            }, 1000);
          }}
          style={styles.input}
        />
        <View
          style={{
            position: "absolute",
            top: RFValue(22),
            left: RFValue(22),
          }}
        >
          <SearchIcon width={22} height={22} />
          <View
            style={{
              height: RFValue(18),
              backgroundColor: "#FFFFFF",
              width: RFValue(1),
              position: "absolute",
              top: RFValue(2),
              left: RFValue(28),
            }}
          />
        </View>
      </View>
      <View
        style={{
          marginTop: RFValue(10),
          marginLeft: RFValue(12),
          marginRight: RFValue(12),
          flex: 1,
        }}
      >
        {loading ? (
          <ActivityIndicator
            style={{ marginTop: RFValue(10) }}
            color={"#FFFFFF"}
            size={"large"}
          />
        ) : (
          <FlatList
            data={locations}
            ListEmptyComponent={() => (
              <CustomText
                style={{
                  color: "#7E86B0",
                  fontSize: RFValue(16),
                  alignSelf: "center",
                }}
              >
                {value.trim().length === 0
                  ? "Please type location."
                  : "Location not found."}
              </CustomText>
            )}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  key={index}
                  id={index}
                  onPress={(r) => flyToCoordinate(item.geometry.coordinates)}
                  style={{
                    borderBottomColor: convertHexToRGBA("#CBD1D9", 20),
                    borderBottomWidth: 1,
                  }}
                >
                  <CustomText
                    style={{ color: "#CBD1D9" }}
                  >{`${maxCharacterHandler(item.properties.name, 45)}${
                    item.properties.city ? "," + " " + item.properties.city : ""
                  }`}</CustomText>
                  <CustomText
                    style={{
                      fontSize: 14,
                      color: "#7E86B0",
                      marginTop: RFValue(2),
                      marginBottom: RFValue(3),
                    }}
                  >
                    {item.properties.country}
                  </CustomText>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    </View>
  );
};

export default SearchbarSwipe;

const styles = StyleSheet.create({
  input: {
    height: RFValue(40),
    margin: RFValue(12),
    borderWidth: 1,
    padding: RFValue(10),
    paddingLeft: RFValue(42),
    borderRadius: RFValue(30),
    backgroundColor: convertHexToRGBA("#CBD1D9", 90),
    color: "#FFFFFF",
  },
});

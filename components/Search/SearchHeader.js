import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, TextInput, TouchableOpacity, View, Keyboard } from "react-native";
import { ArrowLeft, CloseIcon } from "../../assets/svg/illustrations";
import SearchIcon from "../../assets/svg/illustrations/SearchIcon";
import { RFValue } from "react-native-responsive-fontsize";
import { useState, useCallback } from "react";
import { debounce } from "lodash";
import { useDispatch } from "react-redux";
import {SET_SEARCH_ERROR, SET_SEARCH_LOADING, SET_SEARCH_LOCATIONS} from "../../store/actionsName";
import { useTranslation } from "react-i18next";
import {search} from "../../util/helpers/api";

const SearchHeader = ({ closeHandler }) => {
  const { top } = useSafeAreaInsets();
  const [searchText, setSearchText] = useState("");
  const { t } = useTranslation("search");

  const dispatch = useDispatch();

  const handleClear = () => {
    setSearchText("");
    setLocations([]);
    setSearchError(false);
    setLoading(false);
  };

  const debounceFn = useCallback(
    debounce((urlParam) => {
      fetchSearch(urlParam);
    }, 300),
    []
  );

  const setLoading = (status) => {
    dispatch({
      type: SET_SEARCH_LOADING,
      payload: status,
    });
  };

  const setLocations = (locations) => {
    dispatch({
      type: SET_SEARCH_LOCATIONS,
      payload: locations,
    });
  };
  const setSearchError = (status) => {
    dispatch({
      type: SET_SEARCH_ERROR,
      payload: status,
    });
  };


  const fetchSearch = (param) => {
    if (param) {
      search.get(`/api/?q=${param}`).then(({data}) => {
        if (data.features.length === 0) {
          setSearchError(true);
        } else {
          setSearchError(false);
          setLocations(data.features);
        }
      });
    }
  };

  return (
    <View style={{ ...styles.header, paddingTop: top + RFValue(5) }}>
      <TouchableOpacity style={styles.back} onPress={()=>closeHandler(false)}>
        <ArrowLeft color="#808080" width={19} height={19} />
      </TouchableOpacity>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <TextInput
          selectionColor={"#666666"}
          style={styles.search}
          value={searchText}
          placeholder={t("search")}
          onChangeText={(text) => {
            if (text.trim(" ").length > 0) {
              setLoading(true);
              debounceFn(text);
            } else {
              setLoading(false);
              setSearchError(false);
            }
            setSearchText(text);
          }}
        />
        <View style={styles.searchIcon}>
          <SearchIcon
            width={RFValue(19)}
            height={RFValue(19)}
            color={"#191919"}
          />
        </View>
        {searchText && (
          <TouchableOpacity
            style={{
              position: "absolute",
              right: RFValue(15),
              top: RFValue(13),
              borderRadius: RFValue(15),
              backgroundColor: "#D8D8D8",
            }}
            onPress={handleClear}
          >
            <CloseIcon
              width={RFValue(19)}
              height={RFValue(19)}
              color={"white"}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#FFFF",
    paddingBottom: RFValue(13),
    paddingHorizontal: RFValue(18),
    flexDirection: "row",
    alignItems: "center",
  },
  back: {
    width: RFValue(40),
    height: RFValue(40),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RFValue(20),
    backgroundColor: "#ECECEC",
  },
  search: {
    borderColor: "#FFFFFF40",
    borderWidth: RFValue(1),
    borderRadius: RFValue(22.5),
    paddingLeft: RFValue(40),
    paddingRight: RFValue(40),
    paddingVertical: RFValue(10),
    marginLeft: RFValue(10),
    color: "#808080",
    backgroundColor: "#ECECEC",
    fontSize: RFValue(16),
    fontFamily: "Poppins",
    position: "relative",
  },
  searchIcon: {
    position: "absolute",
    top: RFValue(13),
    left: RFValue(25),
  },
});

export default SearchHeader;

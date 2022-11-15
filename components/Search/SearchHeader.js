import {useSafeAreaInsets} from "react-native-safe-area-context";
import {StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import {ArrowLeft} from "../../assets/svg/illustrations";
import SearchIcon from "../../assets/svg/illustrations/SearchIcon";
import {RFValue} from "react-native-responsive-fontsize";
import React from "react";

const SearchHeader = ({closeHandler, setSearchText}) => {
  const {top} = useSafeAreaInsets();

  return (
    <View style={{...styles.header, paddingTop: top}}>
      <TouchableOpacity style={styles.back} onPress={closeHandler}>
        <ArrowLeft/>
      </TouchableOpacity>

      <View style={{flex: 1}}>
        <TextInput style={styles.search} onChangeText={setSearchText}/>

        <View style={styles.searchIcon}>
          <SearchIcon width={RFValue(19)} height={RFValue(19)} color={'#D8D8D8'}/>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#130C47",
    paddingBottom: RFValue(13),
    paddingHorizontal: RFValue(18),
    flexDirection: "row",
    alignItems: "center"
  },
  back: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: RFValue(40),
    height: RFValue(40),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RFValue(20),
  },
  search: {
    borderColor: "#FFFFFF40",
    borderWidth: RFValue(1),
    borderRadius: RFValue(22.5),
    paddingLeft: RFValue(40),
    paddingRight: RFValue(15),
    paddingVertical: RFValue(10),
    marginLeft: RFValue(10),
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: RFValue(16),
    position: "relative"
  },
  searchIcon: {
    position: "absolute",
    top: RFValue(11),
    left: RFValue(25)
  }
})

export default SearchHeader;

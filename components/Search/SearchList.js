import {FlatList, StyleSheet, TouchableOpacity, View} from "react-native";
import {CustomText, CustomTextBold} from "../../highordercomponents";
import {RFValue} from "react-native-responsive-fontsize";
import {maxCharacterHandler} from "../../helper/helper";
import React from "react";
import {NoLocation} from "../../assets/svg/illustrations";

const LocationList = ({index, location, onClick}) => {
  const { properties, geometry } = location


  return (
    <TouchableOpacity
      key={index}
      id={index}
      style={styles.listItem}
      onPress={() => onClick(properties.extent || geometry.coordinates)}
    >
      <CustomText style={styles.address}>
        {`${maxCharacterHandler(properties.name, 45)}${properties.city ? "," + " " + properties.city : ""}`}
      </CustomText>
      <CustomText style={styles.country}>
        {properties.district && properties.district + ' '}
        {properties.city && properties.city + ' '}
        {properties.state && properties.state + ' '}
        {properties.country}
      </CustomText>
    </TouchableOpacity>
  )
}

const emptyList = (search) => {
  if (!!search) {
    return (
      <View style={styles.emptyWrapper}>
        <NoLocation width={RFValue(119)} height={RFValue(138)}/>
        <CustomTextBold style={styles.emptyTitle}>No results found</CustomTextBold>
        <CustomText style={styles.emptyText}>Please make another search.</CustomText>
      </View>
    )
  }
}

const SearchList = ({search, lists, onClick}) => {
  return (
    <FlatList
      data={lists}
      keyExtractor={(_value, i) => i.toString()}
      ListEmptyComponent={() => emptyList(search)}
      renderItem={({item, index}) => <LocationList location={item} index={index} onClick={onClick}/>}
    />
  )
}

const styles = StyleSheet.create({
  listWrapper: {
    marginVertical: RFValue(30)
  },
  listItem: {
    borderBottomWidth: RFValue(1),
    borderColor: '#EAEAEA',
    marginHorizontal: RFValue(18),
    paddingVertical: RFValue(5)
  },
  address: {
    color: '#130C47',
    fontSize: RFValue(14)
  },
  country: {
    color: '#666666',
    fontSize: RFValue(12)
  },
  emptyWrapper: {
    alignItems: "center",
    paddingTop: RFValue(50)
  },
  emptyTitle: {
    color: '#130C47',
    fontSize: RFValue(18),
    textAlign: "center"
  },
  emptyText: {
    color: '#130C47',
    fontSize: RFValue(14)
  }
})

export default SearchList;

import React, {useState} from "react";
import {View, TouchableOpacity, ScrollView, Alert} from "react-native";
import {userUploadStyles} from "../../styles/userUploadStyle";
import {UserFeed} from "../index";
import {Trash} from "../../assets/svg/illustrations";
import {CustomText} from "../../highordercomponents";
import {SwipeListView} from "react-native-swipe-list-view";

const List = ({ navigation }) => {

  const [listData, setListData] = useState(
    Array(20)
      .fill('')
      .map((_, i) => ({ key: `${i}`, text: `item #${i}` }))
  );

  const deleteRow = (rowMap, rowKey) => {
    Alert.alert(
      "Are you sure?",
      "Are you sure you want to delete this project",
      [
        {
          text: "Yes",
          onPress: () => {
            setListData(listData.filter((listData) => listData.key !== rowKey))
          }
        },
        {
          text: "No",
        }
      ]
    )
  };

  const renderItem = data => (
    <View style={userUploadStyles.listItem}>
      <UserFeed key={data.index} data={data.item} navigation={navigation} />
    </View>
  );

  const renderHiddenItem = (data, rowMap) => (
    <View style={userUploadStyles.listItem}>
      <TouchableOpacity
        style={[userUploadStyles.backRightBtn]}
        onPress={() => deleteRow(rowMap, data.item.key)}
      >
        <Trash />
        <CustomText style={userUploadStyles.textWhite}>Delete</CustomText>
      </TouchableOpacity>
    </View>
  );

  return (
    <SwipeListView
      data={listData}
      renderItem={renderItem}
      renderHiddenItem={renderHiddenItem}
      rightOpenValue={-75}
      previewRowKey={'0'}
      previewOpenValue={-40}
      previewOpenDelay={3000}
    />
  );
};

export default List;

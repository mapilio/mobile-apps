import {Modal} from "react-native";
import React, {useEffect, useState} from "react";
import {fetchHandler} from "../../helper/helper";
import Config from "react-native-config";
import SearchHeader from "./SearchHeader";
import SearchList from "./SearchList";

const SearchModal = ({open, closeHandler, onClick}) => {
  const [searchText, setSearchText] = useState("");
  const [locations, setLocations] = useState([]);

  const handleSearchText = (e) => setSearchText(e)

  useEffect(() => {
    fetchHandler({url: `${Config.SEARCH_API}${searchText}`}).then((res) => {
      setLocations(res.features)
    })
  }, [searchText]);

  return (
    <Modal visible={open} animationType={"slide"}>
      <SearchHeader closeHandler={closeHandler} setSearchText={handleSearchText}/>
      <SearchList search={searchText} lists={locations} onClick={onClick}/>
    </Modal>
  )
}

export default SearchModal;

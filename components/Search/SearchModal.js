import {Modal} from "react-native";
import SearchHeader from "./SearchHeader";
import SearchList from "./SearchList";
import FocusAwareStatusBar from "../FocusAwareStatusBar";
import {useSelector, useDispatch} from "react-redux";
import {Loading, NoResult} from "./status";
import { useEffect } from "react";

const SearchModal = ({open, closeHandler, onClick}) => {
  const {isLoading, error} = useSelector(state => state.searchReducer)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({type: "SET_SEARCH_LOCATIONS", payload: []})
    dispatch({type: "SET_SEARCH_ERROR", payload: false})
    dispatch({type: "SET_SEARCH_LOADING", payload: false})
  }, [open, dispatch])
 

  return (
    <Modal visible={open} animationType={"slide"}>
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor={"white"}  />
      <SearchHeader closeHandler={closeHandler}/>
      {isLoading ? <Loading /> : error ? <NoResult /> : <SearchList onClick={onClick}/>}
    </Modal>
  )
}

export default SearchModal;

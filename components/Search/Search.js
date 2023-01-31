import {useEffect, useState} from "react";
import {SearchIcon} from "../../assets/svg/illustrations";
import {TouchableOpacity, View} from "react-native";
import {appMapStyle} from "../../styles/appMapStyle";
import SearchModal from "./SearchModal";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useDispatch} from "react-redux";
import {ADD_SEARCH_HISTORY} from "../../store/actionsName";

const Search = ({camera}) => {
  const {top} = useSafeAreaInsets();
  const [openSearchbar, setOpenSearchbar] = useState(false);
  const dispatch = useDispatch();

  let timeout;

  const addSearchHistory = (searchItem) => {
    dispatch({
      type: ADD_SEARCH_HISTORY,
      payload: searchItem,
    });
  };

  const handleClick = (coordinates, param) => {
    setOpenSearchbar(false)
    timeout = setTimeout(() => {
      coordinates.length === 4 &&
        camera.current.fitBounds([coordinates[0], coordinates[1]], [coordinates[2], coordinates[3]], [20, 20], 1000)

      coordinates.length === 2 &&
        camera.current.setCamera({centerCoordinate: coordinates, zoomLevel: 10, animationDuration: 1000})
    }, 200)
    addSearchHistory({
      param,
      coordinates
    })
  }
  useEffect(() => {
    return () => timeout?.remove()
  }, []);

  return (
    <View style={{...appMapStyle.search, marginTop: top}}>
      <TouchableOpacity onPress={() => setOpenSearchbar(true)}>
        <View style={appMapStyle.searchIcon}>
          <SearchIcon width={19.55} height={19.55} color={'#616161'}/>
        </View>
      </TouchableOpacity>

      <SearchModal
        open={openSearchbar}
        closeHandler={setOpenSearchbar}
        onClick={handleClick}
      />
    </View>
  )
}

export default Search;

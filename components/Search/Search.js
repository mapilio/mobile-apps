import {useEffect, useState} from "react";
import {SearchIcon} from "../../assets/svg/illustrations";
import {TouchableOpacity, View} from "react-native";
import {appMapStyle} from "../../styles/appMapStyle";
import SearchModal from "./SearchModal";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const Search = ({camera}) => {
  const {top} = useSafeAreaInsets();
  const [openSearchbar, setOpenSearchbar] = useState(false);
  let timeout;

  const handleClick = (coordinate) => {
    setOpenSearchbar(false)
    timeout = setTimeout(() => camera.current.setCamera({centerCoordinate: coordinate, zoomLevel: 10}), 200)
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

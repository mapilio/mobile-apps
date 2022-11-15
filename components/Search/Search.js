import {useEffect, useState} from "react";
import {SearchIcon} from "../../assets/svg/illustrations";
import {Pressable, View} from "react-native";
import {appMapStyle} from "../../styles/appMapStyle";
import SearchModal from "./SearchModal";

const Search = ({camera}) => {
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
    <View style={appMapStyle.searchIcon}>
      <Pressable onPress={() => setOpenSearchbar((state) => !state)}>
        <SearchIcon width={19.55} height={19.55}/>
      </Pressable>

      <SearchModal
        open={openSearchbar}
        closeHandler={setOpenSearchbar}
        onClick={handleClick}
      />
    </View>
  )
}

export default Search;

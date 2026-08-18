import { FlatList, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { CustomText } from '../../highordercomponents';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { maxCharacterHandler } from '../../helper/helper';
import { RightTopDirectionIcon } from '../../assets/svg/illustrations';
import { useSelector, useDispatch } from 'react-redux';
import { CLEAR_SEARCH_HISTORY } from '../../store/actionsName';
import { Welcome } from './status';
import { useTranslation } from 'react-i18next';

const LocationList = ({ location, onClick }) => {
  const { properties, geometry } = location;

  const cityAndState = `${maxCharacterHandler(properties.name, 45)}${
    properties.city ? ',' + ' ' + properties.city : ''
  }`;

  if (!properties.name) return null;

  return (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => onClick(properties.extent || geometry.coordinates, cityAndState)}>
      <CustomText style={styles.address}>{cityAndState}</CustomText>
      <CustomText style={styles.country}>
        {properties.district && properties.district + ' '}
        {properties.city && properties.city + ' '}
        {properties.state && properties.state + ' '}
        {properties.country}
      </CustomText>
    </TouchableOpacity>
  );
};

const SearchHistory = ({ onClick }) => {
  const { searchHistory } = useSelector((state) => state.searchReducer);
  const dispatch = useDispatch();
  const { t } = useTranslation('search');

  const handleSearch = (param, coordinates) => {
    onClick(coordinates, param);
  };

  if (searchHistory.length > 0) {
    return (
      <View style={styles.history}>
        <View style={styles.history.wrapper}>
          <Text style={styles.history.title}>{t('recent_searches')}</Text>
          <TouchableOpacity
            onPress={() => {
              dispatch({ type: CLEAR_SEARCH_HISTORY });
            }}
            style={styles.history.clearButton}>
            <Text style={styles.history.clearText}>{t('clear')}</Text>
          </TouchableOpacity>
        </View>
        <View>
          {searchHistory.map((item, key) => {
            return (
              <TouchableOpacity
                key={key}
                onPress={() => {
                  handleSearch(item.param, item.coordinates);
                }}
                style={styles.history.searchList.item}>
                <Text style={styles.history.searchList.title}>{item.param}</Text>
                <View style={styles.history.searchList.icon}>
                  <RightTopDirectionIcon width={RFValue(11)} height={RFValue(11)} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  return <Welcome />;
};

const SearchList = ({ onClick }) => {
  const { locations } = useSelector((state) => state.searchReducer);

  return (
    <FlatList
      data={locations}
      keyboardShouldPersistTaps="always"
      keyExtractor={(_value, i) => i.toString()}
      ListEmptyComponent={<SearchHistory onClick={onClick} />}
      renderItem={({ item, index }) => (
        <LocationList key={index} location={item} index={index} onClick={onClick} />
      )}
    />
  );
};

const styles = StyleSheet.create({
  listWrapper: {
    marginVertical: RFValue(30),
  },
  listItem: {
    borderBottomWidth: RFValue(1),
    borderColor: '#EAEAEA',
    marginHorizontal: RFValue(18),
    paddingVertical: RFValue(5),
  },
  address: {
    color: '#191919',
    fontSize: RFValue(14),
  },
  country: {
    color: '#808080',
    fontSize: RFValue(12),
  },
  history: {
    width: '100%',
    paddingHorizontal: RFValue(20),
    wrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    title: {
      fontFamily: 'Poppins-Medium',
      color: '#808080',
      fontSize: RFValue(14),
    },
    clearButton: {
      backgroundColor: '#ECECEC',
      padding: RFValue(4),
      borderRadius: RFPercentage(5),
      paddingHorizontal: RFValue(10),
    },
    clearText: {
      color: '#808080',
      fontFamily: 'Poppins',
      fontSize: RFValue(11),
    },
    searchList: {
      item: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingVertical: RFValue(10),
      },
      title: {
        fontFamily: 'Poppins-Medium',
        fontSize: RFValue(14),
        color: '#191919',
      },
      icon: {
        alignItems: 'center',
        justifyContent: 'flex-end',
      },
    },
  },
});

export default SearchList;

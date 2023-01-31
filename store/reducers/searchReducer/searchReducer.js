import {
  ADD_SEARCH_HISTORY,
  CLEAR_SEARCH_HISTORY,
  SET_SEARCH_LOCATIONS,
  SET_SEARCH_LOADING,
  SET_SEARCH_ERROR,
} from "../../actionsName";

const initialState = {
  searchHistory: [],
  locations: [],
  searchParam: null,
  isLoading: false,
  error: false,
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_SEARCH_HISTORY:
      if (state.searchHistory.length > 4) {
        state.searchHistory.pop();
      }
      if(!state.searchHistory.filter(item => item.param === action.payload.param).length > 0){
        state.searchHistory.unshift(action.payload);
      }
      return {
        ...state,
        searchHistory: state.searchHistory,
      };

    case CLEAR_SEARCH_HISTORY:
      return {
        ...state,
        searchHistory: [],
      };
    case SET_SEARCH_LOCATIONS:
      return {
        ...state,
        locations: action.payload,
        isLoading: false,
      };
    case SET_SEARCH_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case SET_SEARCH_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default searchReducer;

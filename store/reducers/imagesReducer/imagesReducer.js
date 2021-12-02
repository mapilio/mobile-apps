import {
  UPDATE_SELECTED_IMAGES,
  UPDATE_UPLOADED_IMAGES,
  UPDATE_ALL_SELECT,
} from "../../actionsName";

const INITIAL_STATE = {
  uploadedImages: [
    { id: Math.random(), path: "../assets/images/car.png" },
    { id: Math.random(), path: "../assets/images/car.png" },
    { id: Math.random(), path: "../assets/images/car.png" },
    { id: Math.random(), path: "../assets/images/car.png" },
    { id: Math.random(), path: "../assets/images/car.png" },
    { id: Math.random(), path: "../assets/images/car.png" },
    { id: Math.random(), path: "../assets/images/car.png" },
    { id: Math.random(), path: "../assets/images/car.png" },
    { id: Math.random(), path: "../assets/images/car.png" },
    { id: Math.random(), path: "../assets/images/car.png" },
  ],
  selectedImages: [],
  allSelect: false,
};

const imagesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_SELECTED_IMAGES:
      return {
        ...state,
        selectedImages: action.payload,
      };
    case UPDATE_UPLOADED_IMAGES:
      return {
        ...state,
        uploadedImages: action.payload,
      };
    case UPDATE_ALL_SELECT:
      return {
        ...state,
        allSelect: action.payload,
      };
    default:
      return state;
  }
};

export default imagesReducer;

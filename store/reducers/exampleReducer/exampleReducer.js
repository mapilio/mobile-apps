import { EXAMPLE_BOOLEAN } from "../../actionsName";

const INITIAL_STATE = {
  boolean: false,
};

const allToggle = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case EXAMPLE_BOOLEAN:
      return {
        ...state,
        boolean: !action.payload,
      };
    default:
      return state;
  }
};

export default allToggle;

import { getBooleanFromLocalStorage } from "../utils/localStorage";

const initialState = {
  hideResource: getBooleanFromLocalStorage("hideResource"),
};

const hideResourceReducer = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_HIDE_RESOURCE":
      return { ...state, hideResource: !state.hideResource };
    default:
      return state;
  }
};

export default hideResourceReducer;

import { getBooleanFromLocalStorage } from "../utils/localStorage";

const initialState = {
  isColorBlindMode: getBooleanFromLocalStorage("isColorBlindMode"),
};

const colorBlindModeReducer = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_COLOR_BLIND":
      return { ...state, isColorBlindMode: !state.isColorBlindMode };
    default:
      return state;
  }
};

export default colorBlindModeReducer;

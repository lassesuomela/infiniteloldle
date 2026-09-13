import { getBooleanFromLocalStorage } from "../utils/localStorage";

const initialState = {
  isMonochrome: getBooleanFromLocalStorage("isMonochrome"),
};

const monochromeReducer = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_MONOCHROME":
      return { ...state, isMonochrome: !state.isMonochrome };
    default:
      return state;
  }
};

export default monochromeReducer;

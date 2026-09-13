import { getBooleanFromLocalStorage } from "../utils/localStorage";

const initialState = {
  randomRotate: getBooleanFromLocalStorage("randomRotate"),
};

const randomRotateReducer = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_RANDOM_ROTATE":
      return { ...state, randomRotate: !state.randomRotate };
    default:
      return state;
  }
};

export default randomRotateReducer;

const getInitialStateFromLocalStorage = () => {
  const storedState = localStorage.getItem("isMonochrome");
  const localStorageState = storedState === "true" ? true : false;
  return { isMonochrome: localStorageState };
};

const initialState = getInitialStateFromLocalStorage();

const monochromeReducer = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_MONOCHROME":
      return { ...state, isMonochrome: !state.isMonochrome };
    default:
      return state;
  }
};

export default monochromeReducer;

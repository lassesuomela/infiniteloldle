const getInitialStateFromLocalStorage = () => {
  const storedState = localStorage.getItem("isColorBlindMode");
  const localStorageState = storedState === "true" ? true : false;
  return { isColorBlindMode: localStorageState };
};

const initialState = getInitialStateFromLocalStorage();

const colorBlindModeReducer = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE":
      return { ...state, isColorBlindMode: !state.isColorBlindMode };
    default:
      return state;
  }
};

export default colorBlindModeReducer;

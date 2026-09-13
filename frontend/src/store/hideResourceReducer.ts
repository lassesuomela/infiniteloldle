const getInitialStateFromLocalStorage = () => {
  const storedState = localStorage.getItem("hideResource");
  const localStorageState = storedState === "true" ? true : false;
  return { hideResource: localStorageState };
};

const initialState = getInitialStateFromLocalStorage();

const hideResourceReducer = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_HIDE_RESOURCE":
      return { ...state, hideResource: !state.hideResource };
    default:
      return state;
  }
};

export default hideResourceReducer;

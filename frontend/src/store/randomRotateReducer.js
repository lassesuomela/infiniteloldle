const getInitialStateFromLocalStorage = () => {
  const storedState = localStorage.getItem("randomRotate");
  const localStorageState = storedState === "true" ? true : false;
  return { randomRotate: localStorageState };
};

const initialState = getInitialStateFromLocalStorage();

const randomRotateReducer = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_RANDOM_ROTATE":
      return { ...state, randomRotate: !state.randomRotate };
    default:
      return state;
  }
};

export default randomRotateReducer;

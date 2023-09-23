const getInitialStateFromLocalStorage = () => {
  const storedState = localStorage.getItem("blurMode");
  return { blurMode: storedState };
};
const initialState = getInitialStateFromLocalStorage();

const blurModeReducer = (state = initialState, action) => {
  switch (action.type) {
    case "DEFAULT_BLUR":
      return {
        ...state,
        blurMode: "default",
      };
    case "BLOCKY_BLUR":
      return {
        ...state,
        blurMode: "blocky",
      };
    default:
      return state;
  }
};

export default blurModeReducer;

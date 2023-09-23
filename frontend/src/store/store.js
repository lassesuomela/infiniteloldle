import { configureStore } from "@reduxjs/toolkit";
import colorBlindReducer from "./colorBlindReducer";
import blurModeReducer from "./blurModeReducer";
import { combineReducers } from "redux";

const reducer = combineReducers({
  colorBlindReducer,
  blurModeReducer,
});
const store = configureStore({ reducer });

export default store;

import { configureStore } from "@reduxjs/toolkit";
import colorBlindReducer from "./colorBlindReducer";
import blurModeReducer from "./blurModeReducer";
import hideResourceReducer from "./hideResourceReducer";
import { combineReducers } from "redux";

const reducer = combineReducers({
  colorBlindReducer,
  blurModeReducer,
  hideResourceReducer,
});
const store = configureStore({ reducer });

export default store;

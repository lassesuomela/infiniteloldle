import { configureStore } from "@reduxjs/toolkit";
import colorBlindReducer from "./colorBlindReducer";
import blurModeReducer from "./blurModeReducer";
import hideResourceReducer from "./hideResourceReducer";
import monochromeReducer from "./monochromeReducer";
import randomRotateReducer from "./randomRotateReducer";
import { combineReducers } from "redux";

const reducer = combineReducers({
  colorBlindReducer,
  blurModeReducer,
  hideResourceReducer,
  monochromeReducer,
  randomRotateReducer,
});
const store = configureStore({ reducer });

export default store;

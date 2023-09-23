import { configureStore } from "@reduxjs/toolkit";
import colorBlindReducer from "./colorBlindReducer";
import blurModeReducer from "./blurModeReducer";
import hideResourceReducer from "./hideResourceReducer";
import monochromeReducer from "./monochromeReducer";
import { combineReducers } from "redux";

const reducer = combineReducers({
  colorBlindReducer,
  blurModeReducer,
  hideResourceReducer,
  monochromeReducer,
});
const store = configureStore({ reducer });

export default store;

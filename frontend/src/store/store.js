import { configureStore } from "@reduxjs/toolkit";
import colorBlindReducer from "./colorBlindReducer";
import { combineReducers } from "redux";

const reducer = combineReducers({
  colorBlindReducer,
});
const store = configureStore({ reducer });

export default store;

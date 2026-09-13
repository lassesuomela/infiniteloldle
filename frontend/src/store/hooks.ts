import { useSelector, type TypedUseSelectorHook } from "react-redux";

export type RootState = {
  colorBlindReducer: { isColorBlindMode: boolean };
  blurModeReducer: { blurMode: string };
  hideResourceReducer: { hideResource: boolean };
  monochromeReducer: { isMonochrome: boolean };
  randomRotateReducer: { randomRotate: boolean };
};

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

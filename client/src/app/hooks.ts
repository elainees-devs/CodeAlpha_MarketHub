import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// ==============================
// USE DISPATCH (TYPED)
// ==============================
export const useAppDispatch = () => useDispatch<AppDispatch>();

// ==============================
// USE SELECTOR (TYPED)
// ==============================
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
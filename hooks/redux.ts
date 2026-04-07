import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../types';
import type { store } from '../store/store';

type AppDispatch = typeof store.dispatch;

/**
 * Typed useDispatch hook — use instead of plain useDispatch()
 * @example const dispatch = useAppDispatch();
 */
export const useAppDispatch: () => AppDispatch = useDispatch;

/**
 * Typed useSelector hook — use instead of plain useSelector()
 * @example const auth = useAppSelector(state => state.getTokenReducer.auth);
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

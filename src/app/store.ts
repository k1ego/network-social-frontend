import type { Action, ThunkAction } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import user from '../features/user/userSlice';
import { listenerMiddleware } from '../middleware/auth';
import { api } from './services/api';

export const store = configureStore({
	reducer: { [api.reducerPath]: api.reducer, user },
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware()
			.concat(api.middleware)
			.prepend(listenerMiddleware.middleware),
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
	ThunkReturnType,
	RootState,
	unknown,
	Action
>;

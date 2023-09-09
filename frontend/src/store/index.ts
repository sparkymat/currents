import { configureStore } from '@reduxjs/toolkit';
import appReducer from '../features/App/slice';
import mediaItemsReducer from '../features/MediaItems/slice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    mediaItems: mediaItemsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

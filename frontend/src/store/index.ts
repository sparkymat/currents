import { configureStore } from '@reduxjs/toolkit';
import { reducer as appReducer } from '../features/App/slice';
import { reducer as mediaItemsReducer } from '../features/MediaItems/slice';
import { reducer as mediaItemDetailsReducer } from '../features/MediaItemDetails/slice';
import { reducer as topicsListReducer } from '../features/TopicsList/slice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    mediaItems: mediaItemsReducer,
    mediaItemDetails: mediaItemDetailsReducer,
    topicsList: topicsListReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

import { createSlice } from '@reduxjs/toolkit';
import MediaItem from '../../models/MediaItem';
import fetchMediaItem from './fetchMediaItem';

export interface State {
  item?: MediaItem;
  loading: boolean;
  errorMessage: string;
  showError: boolean;
}

const initialState: State = {
  loading: false,
  errorMessage: '',
  showError: false,
};

const slice = createSlice({
  name: 'mediaItemDetails',
  initialState,
  reducers: {
    dismissError: state => {
      state.showError = false;
      state.errorMessage = '';
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchMediaItem.pending, state => {
      state.loading = true;
    });
    builder.addCase(fetchMediaItem.fulfilled, (state, action) => {
      state.loading = false;
      state.item = action.payload;
    });
    builder.addCase(fetchMediaItem.rejected, (state, action) => {
      state.loading = false;
      state.errorMessage = action.error.message || 'unknown error';
      state.showError = true;
    });
  },
});

export const { dismissError } = slice.actions;

export default slice.reducer;

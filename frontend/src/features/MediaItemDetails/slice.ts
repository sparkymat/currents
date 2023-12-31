import { createSlice } from '@reduxjs/toolkit';
import { MediaItem } from '../../models/MediaItem';
import { fetchMediaItem } from './fetchMediaItem';
import { rescanMediaItem } from './rescanMediaItem';
import { confirmMediaItemTopic } from './confirmMediaItemTopic';
import { deleteMediaItemTopic } from './deleteMediaItemTopic';

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

    builder.addCase(rescanMediaItem.pending, state => {
      state.loading = true;
    });
    builder.addCase(rescanMediaItem.fulfilled, state => {
      state.loading = false;
    });
    builder.addCase(rescanMediaItem.rejected, (state, action) => {
      state.loading = false;
      state.errorMessage = action.error.message || 'unknown error';
      state.showError = true;
    });

    builder.addCase(confirmMediaItemTopic.pending, state => {
      state.loading = true;
    });
    builder.addCase(confirmMediaItemTopic.fulfilled, state => {
      state.loading = false;
    });
    builder.addCase(confirmMediaItemTopic.rejected, (state, action) => {
      state.loading = false;
      state.errorMessage = action.error.message || 'unknown error';
      state.showError = true;
    });

    builder.addCase(deleteMediaItemTopic.pending, state => {
      state.loading = true;
    });
    builder.addCase(deleteMediaItemTopic.fulfilled, state => {
      state.loading = false;
    });
    builder.addCase(deleteMediaItemTopic.rejected, (state, action) => {
      state.loading = false;
      state.errorMessage = action.error.message || 'unknown error';
      state.showError = true;
    });
  },
});

export const { dismissError } = slice.actions;

export const { reducer } = slice;

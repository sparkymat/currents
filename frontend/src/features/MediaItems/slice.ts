import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { MediaItem, MediaItemType } from '../../models/MediaItem';
import { searchMediaItems } from './searchMediaItems';
import { createMediaItem } from './createMediaItem';

export interface State {
  items: MediaItem[];
  page: number;
  pageSize: number;
  query: string;
  filterBarQuery: string;
  totalCount: number;
  loading: boolean;
  errorMessage: string;
  showError: boolean;
  createModalShown: boolean;
  createModalURL: string;
  createModalMediaItemType: MediaItemType;
}

const initialState: State = {
  items: [],
  page: 1,
  pageSize: 10,
  query: '',
  filterBarQuery: '',
  totalCount: 0,
  loading: false,
  errorMessage: '',
  showError: false,
  createModalShown: false,
  createModalURL: '',
  createModalMediaItemType: 'video',
};

const slice = createSlice({
  name: 'mediaItems',
  initialState,
  reducers: {
    updateQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
      state.filterBarQuery = action.payload;
    },
    updatePage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    updateFilterBarQuery: (state, action: PayloadAction<string>) => {
      state.filterBarQuery = action.payload;
    },
    dismissError: state => {
      state.showError = false;
      state.errorMessage = '';
    },
    showCreateModal: state => {
      state.createModalShown = true;
    },
    hideCreateModal: state => {
      state.createModalShown = false;
    },
    updateCreateModalURL: (state, action: PayloadAction<string>) => {
      state.createModalURL = action.payload;
    },
    updateCreateModalMediaItemType: (
      state,
      action: PayloadAction<MediaItemType>,
    ) => {
      state.createModalMediaItemType = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(searchMediaItems.pending, state => {
      state.loading = true;
    });
    builder.addCase(searchMediaItems.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.items.map(i => new MediaItem(i));
      state.totalCount = action.payload.total_count;
    });
    builder.addCase(searchMediaItems.rejected, (state, action) => {
      state.loading = false;
      state.errorMessage = action.error.message || 'unknown error';
      state.showError = true;
    });

    builder.addCase(createMediaItem.pending, state => {
      state.loading = true;
    });
    builder.addCase(createMediaItem.fulfilled, state => {
      state.loading = false;

      state.createModalMediaItemType = 'video';
      state.createModalURL = '';
      state.createModalShown = false;
    });
    builder.addCase(createMediaItem.rejected, (state, action) => {
      state.loading = false;
      state.errorMessage = action.error.message || 'unknown error';
      state.showError = true;
    });
  },
});

export const {
  updateQuery,
  updateFilterBarQuery,
  updatePage,
  dismissError,
  showCreateModal,
  hideCreateModal,
  updateCreateModalMediaItemType,
  updateCreateModalURL,
} = slice.actions;

export const { reducer } = slice;

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Topic } from '../../models/Topic';
import { searchTopics } from './searchTopics';

export interface State {
  items: Topic[];
  page: number;
  pageSize: number;
  query: string;
  filterBarQuery: string;
  totalCount: number;
  loading: boolean;
  errorMessage: string;
  showError: boolean;
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
};

const slice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    dismissError: state => {
      state.showError = false;
    },
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
  },
  extraReducers: builder => {
    builder.addCase(searchTopics.pending, state => {
      state.loading = true;
    });
    builder.addCase(searchTopics.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.items.map(i => new Topic(i));
      state.totalCount = action.payload.total_count;
    });
    builder.addCase(searchTopics.rejected, (state, action) => {
      state.loading = false;
      state.errorMessage = action.error.message || 'unknown error';
      state.showError = true;
    });
  },
});

export const { updateQuery, updatePage, updateFilterBarQuery, dismissError } =
  slice.actions;

export const { reducer } = slice;

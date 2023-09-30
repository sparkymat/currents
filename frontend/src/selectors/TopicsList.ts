import { Topic } from '../models/Topic';
import { RootState } from '../store';

export const selectLoading = (state: RootState): boolean =>
  state.topicsList.loading;

export const selectShowError = (state: RootState): boolean =>
  state.topicsList.showError;

export const selectErrorMessage = (state: RootState): string =>
  state.topicsList.errorMessage;

export const selectItems = (state: RootState): Topic[] =>
  state.topicsList.items;

export const selectTotalCount = (state: RootState): number =>
  state.topicsList.totalCount;

export const selectPageSize = (state: RootState): number =>
  state.topicsList.pageSize;

export const selectQuery = (state: RootState): string => state.topicsList.query;

export const selectFilterBarQuery = (state: RootState): string =>
  state.topicsList.filterBarQuery;

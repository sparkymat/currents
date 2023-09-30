import { MediaItem, MediaItemType } from '../models/MediaItem';
import { RootState } from '../store';

export const selectLoading = (state: RootState): boolean =>
  state.mediaItems.loading;

export const selectShowError = (state: RootState): boolean =>
  state.mediaItems.showError;

export const selectErrorMessage = (state: RootState): string =>
  state.mediaItems.errorMessage;

export const selectItems = (state: RootState): MediaItem[] =>
  state.mediaItems.items;

export const selectTotalCount = (state: RootState): number =>
  state.mediaItems.totalCount;

export const selectPageSize = (state: RootState): number =>
  state.mediaItems.pageSize;

export const selectFilterBarQuery = (state: RootState): string =>
  state.mediaItems.filterBarQuery;

export const selectCreateModalShown = (state: RootState): boolean =>
  state.mediaItems.createModalShown;

export const selectCreateModalURL = (state: RootState): string =>
  state.mediaItems.createModalURL;

export const selectCreateModalMediaItemType = (
  state: RootState,
): MediaItemType => state.mediaItems.createModalMediaItemType;

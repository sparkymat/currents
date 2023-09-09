import MediaItem from '../models/MediaItem';
import { RootState } from '../store';

export const selectLoading = (state: RootState): boolean =>
  state.mediaItemDetails.loading;

export const selectShowError = (state: RootState): boolean =>
  state.mediaItemDetails.showError;

export const selectErrorMessage = (state: RootState): string =>
  state.mediaItemDetails.errorMessage;

export const selectItem = (state: RootState): MediaItem | undefined =>
  state.mediaItemDetails.item;

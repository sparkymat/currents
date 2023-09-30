import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import MediaItem from '../../models/MediaItem';

export interface SearchMediaItemsRequest {
  query: string;
  page: number;
  pageSize: number;
}

export interface SearchMediaItemsResponse {
  items: MediaItem[];
  page_number: number;
  page_size: number;
  total_count: number;
}

export const searchMediaItems = createAsyncThunk<
  SearchMediaItemsResponse,
  SearchMediaItemsRequest
>(
  'mediaItems/SearchMediaItems',
  async ({ page, pageSize, query }: SearchMediaItemsRequest) => {
    const url = `/api/media_items?page_size=${pageSize}&page_number=${page}&query=${encodeURIComponent(
      query,
    )}`;

    const response = await axios.get(url);

    return response.data as SearchMediaItemsResponse;
  },
);

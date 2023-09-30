import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Topic } from '../../models/Topic';

export interface SearchTopicsRequest {
  query: string;
  page: number;
  pageSize: number;
}

export interface SearchTopicsResponse {
  items: Topic[];
  page_number: number;
  page_size: number;
  total_count: number;
}

export const searchTopics = createAsyncThunk<
  SearchTopicsResponse,
  SearchTopicsRequest
>(
  'topicsList/searchTopics',
  async ({ page, pageSize, query }: SearchTopicsRequest) => {
    const url = `/api/topics?page_size=${pageSize}&page_number=${page}&query=${encodeURIComponent(
      query,
    )}`;

    const response = await axios.get(url);

    return response.data as SearchTopicsResponse;
  },
);

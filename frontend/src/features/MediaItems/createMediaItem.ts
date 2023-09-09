import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import MediaItem, { MediaItemType } from '../../models/MediaItem';
import searchMediaItems from './searchMediaItems';

interface CreateMediaItemRequest {
  url: string;
  item_type: MediaItemType;
}

const createMediaItem = createAsyncThunk<MediaItem, CreateMediaItemRequest>(
  'mediaItems/createMediaItem',
  async (request: CreateMediaItemRequest, thunkAPI) => {
    const csrf = (document.querySelector('meta[name="csrf-token"]') as any)
      .content;

    const response = await axios.post('/api/media_items', request, {
      headers: {
        'X-CSRF-Token': csrf,
      },
    });

    thunkAPI.dispatch(searchMediaItems({ page: 1, pageSize: 10, query: '' }));

    return new MediaItem(response.data);
  },
);

export default createMediaItem;

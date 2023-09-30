import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { MediaItem } from '../../models/MediaItem';

export const fetchMediaItem = createAsyncThunk<MediaItem, string>(
  'mediaItemDetails/fetchMediaItem',
  async id => {
    const url = `/api/media_items/${id}`;

    const response = await axios.get(url);

    return new MediaItem(response.data);
  },
);

import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { fetchMediaItem } from './fetchMediaItem';

export const rescanMediaItem = createAsyncThunk<void, string>(
  'mediaItems/rescanMediaItem',
  async (id, thunkAPI) => {
    const csrf = (document.querySelector('meta[name="csrf-token"]') as any)
      .content;

    await axios.post(
      `/api/media_items/${id}/rescan`,
      {},
      {
        headers: {
          'X-CSRF-Token': csrf,
        },
      },
    );

    thunkAPI.dispatch(fetchMediaItem(id));
  },
);

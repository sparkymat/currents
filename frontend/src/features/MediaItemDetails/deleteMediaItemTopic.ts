import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { fetchMediaItem } from './fetchMediaItem';

export interface DeleteMediaItemTopicRequest {
  mediaItemID: string;
  topicID: string;
}

export const deleteMediaItemTopic = createAsyncThunk<
  void,
  DeleteMediaItemTopicRequest
>(
  'mediaItems/deleteMediaItemTopic',
  async ({ mediaItemID, topicID }: DeleteMediaItemTopicRequest, thunkAPI) => {
    const csrf = (document.querySelector('meta[name="csrf-token"]') as any)
      .content;

    await axios.delete(`/api/media_items/${mediaItemID}/topics/${topicID}`, {
      headers: {
        'X-CSRF-Token': csrf,
      },
    });

    thunkAPI.dispatch(fetchMediaItem(mediaItemID));
  },
);

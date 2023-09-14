import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import fetchMediaItem from './fetchMediaItem';

export interface ConfirmMediaItemTopicRequest {
  mediaItemID: string;
  topicID: string;
}

const confirmMediaItemTopic = createAsyncThunk<
  void,
  ConfirmMediaItemTopicRequest
>(
  'mediaItems/confirmMediaItemTopic',
  async ({ mediaItemID, topicID }: ConfirmMediaItemTopicRequest, thunkAPI) => {
    const csrf = (document.querySelector('meta[name="csrf-token"]') as any)
      .content;

    await axios.post(
      `/api/media_items/${mediaItemID}/topics/${topicID}/confirm`,
      {},
      {
        headers: {
          'X-CSRF-Token': csrf,
        },
      },
    );

    thunkAPI.dispatch(fetchMediaItem(mediaItemID));
  },
);

export default confirmMediaItemTopic;

import moment from 'moment';

export type MediaItemType = 'video' | 'article';

export type MediaItemState = 'pending' | 'processing' | 'processed' | 'failed';

class MediaItem {
  public id: string;

  public title: string;

  public url: string;

  public item_type: MediaItemType;

  public state: MediaItemState;

  public published_at: moment.Moment;

  public video_url?: string;

  public thumbnail_url?: string;

  public subtitle_urls: string[];

  public transcript?: string;

  public metadata?: { [key: string]: any };

  constructor(json: any) {
    this.id = json.id;
    this.title = json.title;
    this.url = json.url;
    this.item_type = json.item_type;
    this.state = json.state;

    this.published_at = moment(json.published_at);
    this.video_url = json.video_url;
    this.thumbnail_url = json.thumbnail_url;
    this.subtitle_urls = json.subtitle_urls || [];

    this.transcript = json.transcript;
    this.metadata = json.metadata || {};
  }
}

export default MediaItem;

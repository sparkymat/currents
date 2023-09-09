export enum MediaItemType {
  Unknown = 'unknown',
  Video = 'video',
  Article = 'article',
}

class MediaItem {
  public id: string;

  public title: string;

  public url: string;

  public item_type: MediaItemType;

  constructor(json: any) {
    this.id = json.id;
    this.title = json.title;
    this.url = json.url;

    switch (json.item_type) {
      case MediaItemType.Article:
        this.item_type = json.item_type;
        break;
      case MediaItemType.Video:
        this.item_type = json.item_type;
        break;
      default:
        this.item_type = MediaItemType.Unknown;
        break;
    }
  }
}

export default MediaItem;

class Topic {
  public id: string;

  public name: string;

  public description: string;

  public keywords: string[];

  constructor(json: any) {
    this.id = json.id;
    this.name = json.name;
    this.description = json.description;
    this.keywords = json.keywords;
  }
}

export default Topic;

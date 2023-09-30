export class Topic {
  public id: string;

  public name: string;

  public description: string;

  public keywords: string[];

  public confirmed: boolean;

  constructor(json: any) {
    this.id = json.id;
    this.name = json.name;
    this.description = json.description;
    this.keywords = json.keywords;
  }
}

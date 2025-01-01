export class RecipeFetcher {
  url: string;
  constructor(url: string) {
    this.url = url;
  }

  async fetchRecipe(): Promise<string> {
    const response = await fetch(this.url);
    const data = await response.text();
    return data;
  }
}
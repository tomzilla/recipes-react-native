import { RecipeFetcher } from "./RecipeFetcher.ts";

export interface RecipeHandlerConfig {
  url: string;
}

export class RecipeHandler<T extends RecipeFetcher> {
  url: string;
  fetcher: T;
  constructor(private f: new (url: string) => T, config: RecipeHandlerConfig) {
    this.url = config.url;
    this.fetcher = new f(this.url);
    console.log("RecipeHandler constructor");
  }
  public async fetchRecipe(): Promise< {content: string, image_url: string}> {
    const remoteData = await this.fetcher.fetchRecipe();

    return this.parseData(remoteData);
  }

  parseData(data: string): {content: string, image_url: string} {
    throw new Error("Not implemented");
  }

  // async saveRecipe() {
  //   console.log("Start fetching recipe");
  //   const recipeContent = await this.fetchRecipe();
  //   const {url, title, content} = this.parseData(recipeContent);
  //   console.log("Saving recipe: ", url, title, content);
  //   const {data} = await supabase.functions.invoke('generate-graph',
  //     {
  //       body: {url, title, content}
  //     }
  //   )

  // }
}
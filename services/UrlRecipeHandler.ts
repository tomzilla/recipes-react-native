import { RecipeFetcher } from "./RecipeFetcher.ts";
import { RecipeHandler, RecipeHandlerConfig } from "./RecipeHandler.ts";

export class UrlRecipeHandler<T extends RecipeFetcher> extends RecipeHandler<T> {
  parseData(data: string): {content: string, image_url: string} {
    console.log("Start replace: ", new Date().toLocaleTimeString());

    const image_url = data.match(/<meta.*?og:image".*?content="(?<url>.*?)"/)?.[1]

    console.log("Match: ", image_url)

    let content = data.match(/<body[\S\s]*?>[\S\s]*?<\/body>/g)?.[0];
    content = content?.replace(/<(style|img|script)[\S\s]*?>[\S\s]*?<\/(style|img|script)>/g, '');
    content = content?.replace(/<[\S\s]*?>/g, '');
    content = content?.replace(/[\n\t]/g, '');
    console.log('content length: ', content?.length);
    console.log("End replace: ", new Date().toLocaleTimeString());

    return {content: content || "", image_url: image_url || ""} ;
  }
}
import { RecipeFetcher } from "./RecipeFetcher.ts";
import { RecipeHandler, RecipeHandlerConfig } from "./RecipeHandler.ts";

export class UrlRecipeHandler<T extends RecipeFetcher> extends RecipeHandler<T> {
  parseData(data: string): {url: string, title: string, content: string} {
    var el = document.createElement( 'html' );
    el.innerHTML = data;
    const url = this.url.split(/[?#]/)[0] ;
    const title = el.querySelector('title')?.textContent || "";
    let content = el.querySelector('body')?.textContent || "";
    console.log("Start replace: ", new Date().toLocaleTimeString());
    content = content?.replace(/<(style|img|script)[\S\s]*?>[\S\s]*?<\/(style|img|script)>/g, '');
    content = content?.replace(/<[\S\s]*?>/g, '');
    content = content?.replace(/[\n\t]/g, '');
    console.log('content length: ', content?.length);
    console.log("End replace: ", new Date().toLocaleTimeString());

    return {url, title, content};
  }
}
import { useEffect, useState } from "react";
import { Button } from "@/vendor/components/ui/button";
import * as Clipboard from 'expo-clipboard';
import { UrlRecipeHandler } from "@/services/UrlRecipeHandler";
import { Platform } from "react-native";
import { Text } from "@rneui/themed";
import { UrlRecipeFetcher } from "@/services/UrlRecipeFetcher";
import { supabase } from "@/services/SupabaseClient";
import { SavedRecipesType } from "./ViewSavedRecipeButton";

// async function getTabContent(tab: chrome.tabs.Tab) {
//   const tabId = (tab === null ? 0 : tab.id) as number;
//   const results = await chrome.scripting.executeScript({
//     target: { tabId: tabId },
//     // injectImmediately: true,  // uncomment this to make it execute straight away, other wise it will wait for document_idle
//     func: DOMtoString,
//     args: ['body']  // you can use this to target what element to get the html for
//   });
//   let content = results[0].result;
//   console.log("Start replace: ", new Date().toLocaleTimeString());
//   content = content?.replace(/<(style|img|script)[\S\s]*?>[\S\s]*?<\/(style|img|script)>/g, '');
//   content = content?.replace(/<[\S\s]*?>/g, '');
//   content = content?.replace(/[\n\t]/g, '');
//   console.log('content length: ', content?.length);
//   console.log("End replace: ", new Date().toLocaleTimeString());
//   return {content};
// }

function DOMtoString(selectorStr: string): string {
  let selector: HTMLElement | null;
  if (selectorStr) {

    selector = document.querySelector(selectorStr);
    if (!selector) return "ERROR: querySelector failed to find node"
  } else {
    selector = document.documentElement;
  }
  if (selector === null) {
    return "";
  }
  return selector.outerHTML;
}

interface GenerateButtonProps {
  onGenerate: () => void
  savedRecipes: SavedRecipesType[]
};

export function GenerateButton({ onGenerate, savedRecipes }: GenerateButtonProps) {
  const [copiedText, setCopiedText] = useState("");
  const [loading, setLoading] = useState<Boolean>(false);
  useEffect(() => {
    let subscription: Clipboard.Subscription;
    if (Platform.OS !== 'web') {
      subscription = Clipboard.addClipboardListener((ClipboardEvent) => {
        Clipboard.getStringAsync().then(content => {
          console.log("New Clipboard content: ", content);
          setCopiedText(content);
        });
      });
    }
    (async () => {
      const text = await Clipboard.getStringAsync();
      console.log("Existing Clipboard content: ", text);
      setCopiedText(text);
    })();
    return () => {
      Platform.OS !== 'web' && subscription && Clipboard.removeClipboardListener(subscription);
    };
  }, []);

  // useInterval(() => {

  // }, 1000);

  if (copiedText.startsWith("http")) {
    const urlHandler = new UrlRecipeHandler<UrlRecipeFetcher>(UrlRecipeFetcher, { url: copiedText });
    return (
      <Button
        size="sm"
        className="w-full"
        onPress={() => {
          (async () => {
            const {data} = await supabase.functions.invoke('generate-graph',
            {
              body: {url: copiedText}
            }
          )
          })();
        }}
      >
        {loading ? <Text>'Working...'</Text> : (loading ? <Text>'View Saved Chart'</Text>: <Text>'Transform & Save This Recipe'</Text>)}
      </Button>);
  } else {
    return null;
  }

}
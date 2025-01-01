export async function getActiveTabContent() {
    const tabs = await chrome
        .tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs.length == 0 ? null : tabs[0];
    const url = activeTab?.url;
    const title = activeTab?.title;
    const activeTabId = (activeTab === null ? 0 : activeTab.id) as number;
    const results = await chrome.scripting.executeScript({
        target: { tabId: activeTabId },
        // injectImmediately: true,  // uncomment this to make it execute straight away, other wise it will wait for document_idle
        func: DOMtoString,
        args: ['body']  // you can use this to target what element to get the html for
    });
    let content = results[0].result;
    content = content?.replace(/<script[\S\s]*?>[\S\s]*?<\/script>/g, '');
    content = content?.replace(/<style[\S\s]*?>[\S\s]*?<\/style>/g, '');
    content = content?.replace(/<img[\S\s]*?>[\S\s]*?<\/img>/g, '');
    content = content?.replace(/<[\S\s]*?>/g, '');
    content = content?.replace(/\n/g, '');
    content = content?.replace(/\t/g, '');
    content = content?.replace(/comments|Comments.*/g, '');
    console.log('content length: ', content?.length);
    return {content, url, title};
}

function DOMtoString(selectorStr: string): string {
    let selector: HTMLElement|null; 
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
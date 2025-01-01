import * as Clipboard from 'expo-clipboard';

export const useClipboard = () => {
  async function fetchClipboardContent() {
    return await Clipboard.getStringAsync();
  }

  async function clipboardContainsUrl() {
    const content = await fetchClipboardContent();
    return content.startsWith('http');
  }

  return {
    fetchClipboardContent,
    clipboardContainsUrl
  };
};

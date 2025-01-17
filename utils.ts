import type { Message } from '~types';

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getDocumentIds = () => {
  const headChildren = document.head.children;
  let documentId = '';
  let uuid = '';

  for (var i = 0; i < headChildren.length; i++) {
    var tmp = headChildren[i].getAttribute('name');
    if (tmp === 'document_id') {
      documentId = headChildren[i].textContent;
    } else if (tmp === 'document_version_independent_id') {
      uuid = headChildren[i].textContent;
    }
  }
  return [documentId, uuid];
};

export class Logger {
  public static info(message: string) {
    console.log(`[INF] ${message}`);
  }

  public static error(message: string) {
    console.log(`[ERR] ${message}`);
  }
}

/**
 *
 * @param isBackground: If you send message from background, set this to true
 * @param message: Message
 * @returns
 */
export const sendMessage = async (isBackground: boolean, message: Message) => {
  if (isBackground) {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    });
    return await chrome.tabs.sendMessage(tab.id, message);
  } else {
    return await chrome.runtime.sendMessage(message);
  }
};

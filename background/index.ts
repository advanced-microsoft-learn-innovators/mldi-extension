import { showWordDescriptionCard } from './contextMenus/word-description';
import { MessageType, type Message } from '~types';
import handleApi from './messages/api';
import handleRelay from './messages/relay';
import { Storage } from '@plasmohq/storage';
import { Logger } from '~utils';

/**
 * Background script (service worker) for the extension.
 * To handle messaging between the extension and the content script, use Chrome Messaging API.
 * Because Plasmo messaging system is partially public alpha, it SHOULD NOT be used in the extension.
 */

// add contextMenu
chrome.contextMenus.create({
  id: 'word-description',
  title: '単語の解説を表示する',
  contexts: ['selection']
});

// add contextMenu clicked action
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'word-description') {
    showWordDescriptionCard(info);
  }
  return true;
});

// add message listener
chrome.runtime.onMessage.addListener(
  (message: Message, sender, sendResponse) => {
    Logger.info(`background: ${message.type}:${message.command}`);
    switch (message.type) {
      case MessageType.API:
        handleApi(message, sender, sendResponse);
        return;
      case MessageType.RELAY:
        handleRelay(message);
        return;
      case MessageType.CONTEXT_MENU:
        return;
      default:
        return;
    }
  }
);

// create storage
export const storage = new Storage();

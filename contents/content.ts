import { MessageToBrowserCommand, MessageType, type Message } from '~types';
import { Logger } from '~utils';

const getDocumentIds = () => {
  const headChildren = document.head.children;
  let documentId = '';
  let uuid = '';

  for (var i = 0; i < headChildren.length; i++) {
    var tmp = headChildren[i].getAttribute('name');
    if (tmp === 'document_id') {
      documentId = headChildren[i].getAttribute('content');
    } else if (tmp === 'document_version_independent_id') {
      uuid = headChildren[i].getAttribute('content');
    }
  }
  return [documentId, uuid];
};

window.addEventListener('load', async () => {
  Logger.info('content.ts loaded');
  chrome.runtime.onMessage.addListener(
    (message: Message, sender, sendResponse) => {
      Logger.info(`content.ts: ${message.type}:${message.command}`);
      if (message.type !== MessageType.TO_BROWSER) return;
      switch (message.command) {
        case MessageToBrowserCommand.GET_DOCUMENT_IDS:
          const [documentId, uuid] = getDocumentIds();
          sendResponse({
            documentId,
            uuid
          });
          return;
        default:
          Logger.info(`Unknown command: ${message.command}`);
          return;
      }
    }
  );
});

import type { Message } from '~types';

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
  console.log('content.ts loaded');
  chrome.runtime.onMessage.addListener(
    (message: Message, sender, sendResponse) => {
      const [documentId, uuid] = getDocumentIds();
      sendResponse({
        documentId,
        uuid
      });
    }
  );
});

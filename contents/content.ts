import type { Message } from '~types';

const getDocumentIds = () => {
  const headChildren = document.head.children;
  let documentId = '';
  let uuid = '';
  let url = '';

  for (var i = 0; i < headChildren.length; i++) {
    var tmp = headChildren[i].getAttribute('name');
    if (tmp === 'document_id') {
      documentId = headChildren[i].getAttribute('content');
    } else if (tmp === 'document_version_independent_id') {
      uuid = headChildren[i].getAttribute('content');
    }
  }

  url = window.location.href;
  return [documentId, uuid, url];
};

window.addEventListener('load', async () => {
  console.log('content.ts loaded');
  chrome.runtime.onMessage.addListener(
    (message: Message, sender, sendResponse) => {
      switch (message.command) {
        case 'getDocumentIds':
          const [documentId, uuid, url] = getDocumentIds();
          sendResponse({
            documentId,
            uuid,
            url
          });
      }
    }
  );
});

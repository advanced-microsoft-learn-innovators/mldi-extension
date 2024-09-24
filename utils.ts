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

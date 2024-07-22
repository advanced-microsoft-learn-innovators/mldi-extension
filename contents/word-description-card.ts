import type { Message } from '~types';

const fetchKeywordsAndAddClassToAllKeywords = () => {
  const allContent = document.getElementsByClassName('content')[0];
  Array.from(allContent.children).forEach(async (node) => {
    if (node.tagName === 'PLASMO-CSUI') return; // Skip the Plasmo UI
    if (node.tagName === 'H1') return; // Skip the title
    if (node.tagName === 'NAV') return; // Skip the navigation
    if (node.classList.contains('page-metadata-container')) return; // Skip the metadata
    if (node.classList.contains('heading-wrapper')) return; // Skip the heading
    // TODO: Check if URL is not rewritten.

    // get the word list using api
    const keywords: Array<string> = (
      await chrome.runtime.sendMessage({
        type: 'api',
        command: 'fetchWordList',
        data: {
          url: window.location.href
        }
      })
    ).wordList;

    // replace the word with a span element that has .mldi-word-desc class
    const newNode = document.createElement(node.tagName);
    newNode.innerHTML = node.innerHTML;
    newNode.className = node.className;
    keywords.forEach((keyword) => {
      if (!node.innerHTML.includes(keyword)) return;
      newNode.innerHTML = newNode.innerHTML.replaceAll(
        keyword,
        `<span class='mldi-word-desc'>${keyword}</span>`
      );
    });
    allContent.replaceChild(newNode, node);
  });
};

window.addEventListener('load', () => {
  // fetch keywords and add the class to all the keywords
  fetchKeywordsAndAddClassToAllKeywords();

  // add underline to .mldi-word-desc
  const style = document.createElement('style');
  style.textContent = `
    .mldi-word-desc {
      border-bottom: 1px dashed gray;
    }
  `;
  document.head.appendChild(style);

  // add message listener
  // MEMO: Maybe addLisnter could be a separate file?
  chrome.runtime.onMessage.addListener(
    (message: Message, sender, sendResponse) => {
      switch (message.command) {
        case 'getRect':
          const selection = window.getSelection();
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();

          const allContent = document.getElementsByClassName('content')[0];
          const contentRect = allContent.getBoundingClientRect();

          const scrollX =
            window.pageXOffset || document.documentElement.scrollLeft;
          const scrollY =
            window.pageYOffset || document.documentElement.scrollTop;

          sendResponse({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            width: rect.width,
            height: rect.height,
            scrollX: scrollX,
            scrollY: scrollY,
            cursorX: rect.x + rect.width / 2,
            cursorY: rect.y,
            contentWidth: contentRect.width,
            contentLeft: contentRect.left
          });
          return;
        default:
          return;
      }
    }
  );
});

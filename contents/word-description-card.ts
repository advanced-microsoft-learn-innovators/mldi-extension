import type { Message } from '~types';

const fetchKeywordsAndAddClassToAllKeywords = async () => {
  const allContent = document.getElementsByClassName('content')[0];
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
  Array.from(allContent.children).forEach(async (node) => {
    if (node.tagName === 'PLASMO-CSUI') return; // Skip the Plasmo UI
    if (node.tagName === 'H1') return; // Skip the title
    if (node.tagName === 'NAV') return; // Skip the navigation
    if (node.classList.contains('page-metadata-container')) return; // Skip the metadata
    if (node.classList.contains('heading-wrapper')) return; // Skip the heading
    // TODO: Check if URL is not rewritten.

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
  addHoverActionToKeywords(allContent);
};

const addHoverActionToKeywords = (allContent: Element) => {
  const contentRect = allContent.getBoundingClientRect();
  const keywordElements = document.getElementsByClassName('mldi-word-desc');
  Array.from(keywordElements).forEach((element: Element) => {
    element.addEventListener('mouseenter', (event: MouseEvent) => {
      // when the mouse enters the keyword,
      // 1. get position of the word.
      const clientRect = element.getBoundingClientRect();
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const rect = {
        left: clientRect.left,
        top: clientRect.top,
        right: clientRect.right,
        width: clientRect.width,
        height: clientRect.height,
        scrollX: scrollX,
        scrollY: scrollY,
        cursorX: event.clientX,
        cursorY: event.clientY,
        contentWidth: contentRect.width,
        contentLeft: contentRect.left
      };

      // 2. show the card and the word (selected text)
      chrome.runtime.sendMessage({
        type: 'relay',
        command: 'showCard',
        data: {
          word: element.textContent,
          rect: rect
        }
      });

      // 3. if timeoutId is exist, clear the timeout
      chrome.runtime.sendMessage({
        type: 'relay',
        command: 'deleteTimeout'
      });
    });

    element.addEventListener('mouseleave', () => {
      // when the mouse leaves the keyword,
      // hide the card in 2000ms
      chrome.runtime.sendMessage({
        type: 'relay',
        command: 'setTimeout',
        data: {
          time: 2000
        }
      });
    });
  });
};

window.addEventListener('load', async () => {
  // fetch keywords and add the class to all the keywords
  await fetchKeywordsAndAddClassToAllKeywords();

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

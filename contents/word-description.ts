import type { PlasmoCSConfig } from 'plasmo';

export const config: PlasmoCSConfig = {
  matches: ['https://learn.microsoft.com/*']
};

// sample keywords
const keywords = [
  'Teams',
  'チーム',
  'チャネル',
  'ゲストアクセス',
  'Microsoft Entra',
  'Microsoft 365',
  '多要素認証',
  '条件付きアクセス',
  'SharePoint'
];

const getAllContent = (keywords: Array<string>) => {
  const allContent = document.getElementsByClassName('content')[0];
  Array.from(allContent.children).forEach((node) => {
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
  const contentRect = allContent.getBoundingClientRect();
  const wordElements = document.getElementsByClassName('mldi-word-desc');
  Array.from(wordElements).forEach((element) => {
    // Add event listeners to each word element
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

      // 3. fetch description of the word and show description
      chrome.runtime.sendMessage({
        type: 'api',
        command: 'fetchWordDescription',
        data: {
          word: element.textContent
        }
      });

      // 4. if timeoutId is exist, clear the timeout
      chrome.runtime.sendMessage({
        type: 'relay',
        command: 'deleteTimeout'
      });
    });

    element.addEventListener('mouseleave', () => {
      // if the mouse leaves the word
      // hide the card after 2 seconds
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

window.addEventListener('load', () => {
  getAllContent(keywords);

  // add style to .mldi-word-desc
  const style = document.createElement('style');
  style.textContent = `
    .mldi-word-desc {
      cursor: pointer;
      border-bottom: 1px dashed gray;
    }
  `;
  document.head.appendChild(style);

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type !== 'contextMenus') return;
    switch (request.command) {
      case 'get-rect':
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
    }
  });
});

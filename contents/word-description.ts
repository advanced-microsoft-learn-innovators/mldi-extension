import type { PlasmoCSConfig } from 'plasmo';
import { store } from '~store';
import { setHover, setNotHover, setRect, setWord } from '~word-state';

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

    const newNode = document.createElement(node.tagName);
    newNode.innerHTML = node.innerHTML;
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
      // if the mouse enters the word, set isHover to true
      store.dispatch(setHover());
      store.dispatch(setWord({ word: element.textContent }));
      const rect = element.getBoundingClientRect();
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      store.dispatch(
        setRect({
          rect: {
            left: rect.left,
            top: rect.top,
            right: rect.right,
            width: rect.width,
            height: rect.height,
            scrollX: scrollX,
            scrollY: scrollY,
            cursorX: event.clientX,
            cursorY: event.clientY,
            contentWidth: contentRect.width,
            contentLeft: contentRect.left
          }
        })
      );
    });

    element.addEventListener('mouseleave', () => {
      // if the mouse leaves the word, set isHover to false
      store.dispatch(setNotHover());
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
});

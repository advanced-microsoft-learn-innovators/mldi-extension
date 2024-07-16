import type { PlasmoCSConfig } from 'plasmo';
import { store } from '~store';
import { setHover, setNotHover, setRect, setWord } from '~word-state';

export const config: PlasmoCSConfig = {
  matches: ['https://learn.microsoft.com/*']
};

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

const getAllContent = () => {
  const allContent = document.getElementsByClassName('content')[0];
  Array.from(allContent.children).forEach((node) => {
    if (node.tagName === 'P') {
      const newNode = document.createElement('p');
      newNode.innerHTML = node.innerHTML;
      keywords.forEach((keyword) => {
        if (node.innerHTML.includes(keyword)) {
          newNode.innerHTML = newNode.innerHTML.replaceAll(
            keyword,
            `<span class='mldi-word-desc' style='color: red;'>${keyword}</span>`
          );
        }
      });
      allContent.replaceChild(newNode, node);
    }
  });
  const contentRect = allContent.getBoundingClientRect();
  const wordElements = document.getElementsByClassName('mldi-word-desc');
  Array.from(wordElements).forEach((element) => {
    element.addEventListener('mouseenter', (event) => {
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
      store.dispatch(setNotHover());
    });
  });
};

window.addEventListener('load', () => {
  getAllContent();
});

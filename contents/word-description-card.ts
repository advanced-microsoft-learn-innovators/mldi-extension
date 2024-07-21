import type { Message } from '~types';

window.addEventListener('load', () => {
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

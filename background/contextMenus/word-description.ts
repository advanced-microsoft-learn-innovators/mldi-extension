import { MessageToBrowserCommand, MessageType } from '~types';
import { sendMessage } from '~utils';

export const showWordDescriptionCard = (info) => {
  const selectedText = info.selectionText;
  (async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    });

    // Todo: Define and use types or interfaces for the messages
    // 1. get position of selected text
    const rect = await sendMessage(true, {
      type: MessageType.TO_BROWSER,
      command: MessageToBrowserCommand.GET_RECT
    });

    // 2. show the card and the word (selected text)
    await sendMessage(true, {
      type: MessageType.TO_BROWSER,
      command: MessageToBrowserCommand.SHOW_CARD,
      data: {
        word: selectedText,
        rect: rect
      }
    });

    // 3. set timeout to hide card, 5000ms
    await sendMessage(true, {
      type: MessageType.TO_BROWSER,
      command: MessageToBrowserCommand.SET_TIMEOUT,
      data: {
        time: 5000
      }
    });
  })();
};

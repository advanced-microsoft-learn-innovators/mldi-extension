export const showWordDescriptionCard = (info) => {
  const selectedText = info.selectionText;
  (async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    });

    // 1. get position of selected text
    const rect = await chrome.tabs.sendMessage(tab.id, {
      type: 'contextMenus',
      command: 'getRect'
    });

    // 2. show the card and the word (selected text)
    await chrome.tabs.sendMessage(tab.id, {
      type: 'contextMenus',
      command: 'showCard',
      data: {
        word: selectedText,
        rect: rect
      }
    });

    // 3. fetch description of the word
    const response = await chrome.runtime.sendMessage({
      type: 'api',
      command: 'fetchWordList',
      data: {
        word: selectedText
      }
    });

    // 4. show the description
    await chrome.tabs.sendMessage(tab.id, {
      type: 'contextMenus',
      command: 'addDescription',
      data: {
        description: response.data
      }
    });

    // 5. set timeout to hide card, 5000ms
    await chrome.tabs.sendMessage(tab.id, {
      type: 'contextMenus',
      command: 'setTimeout',
      data: {
        time: 5000
      }
    });
  })();
};

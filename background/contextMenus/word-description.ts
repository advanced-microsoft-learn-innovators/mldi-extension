const handler = (info) => {
  const selectedText = info.selectionText;
  // const response: AxiosResponse = await axios.get(
  //   `http://localhost:3000/word-description/${selectedText}`
  // );
  const response = {
    data: `I cannot describe ${selectedText}.`,
    status: 200
  };
  (async (response) => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    });
    const payload = {
      type: 'contextMenus',
      command: info.menuItemId,
      message: {
        word: selectedText,
        description: response.data
      }
    };
    const res = await chrome.tabs.sendMessage(tab.id, payload);
    console.log(res);
  })(response);
};

export default handler;

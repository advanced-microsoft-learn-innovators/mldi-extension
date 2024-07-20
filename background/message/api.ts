import type { Message } from '~types';

export const handleApi = (message: Message) => {
  if (message.type !== 'api') return;
  switch (message.command) {
    case 'fetchWordDescription':
      (async () => {
        const word = message.data.word;

        const [tab] = await chrome.tabs.query({
          active: true,
          lastFocusedWindow: true
        });
        // const response: AxiosResponse = await axios.get(
        //   `http://localhost:3000/word-description/${word};
        // );
        const response = {
          data: `I cannot describe ${word}.`,
          status: 200
        };
        await chrome.tabs.sendMessage(tab.id, {
          type: 'contextMenus',
          command: 'addDescription',
          data: {
            description: response.data
          }
        });
      })();
      return;
    default:
      console.log(`api: ${message.command} is not found`);
      return;
  }
};

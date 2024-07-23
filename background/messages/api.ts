import type { Message } from '~types';

const handleApi = (
  message: Message,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => {
  switch (message.command) {
    case 'fetchWordDescription':
      // fetch description of the word
      (async () => {
        const word = message.data.word;
        const response = {
          data: `I cannot describe ${word}.`,
          status: 200
        };
        sendResponse({
          description: response.data
        });
      })();
      return;
    default:
      return;
  }
};

export default handleApi;

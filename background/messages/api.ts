import type { Message } from '~types';

const handleApi = (
  message: Message,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => {
  switch (message.command) {
    case 'fetchWordList':
      // fetch word list from the storage
      (async () => {
        const url = message.data.url;
        // const response: AxiosResponse = await axios.get(
        //   `http://localhost:3000/word-description/${url}`
        // );
        const response = ['Teams', 'Entra', 'チーム', 'チャネル', '多要素認証'];
        sendResponse({
          wordList: response
        });
      })();
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

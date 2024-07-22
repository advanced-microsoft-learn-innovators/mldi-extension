import type { AxiosResponse } from 'axios';
import axios from 'axios';
import type { Message } from '~types';

const handleApi = (
  message: Message,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => {
  switch (message.command) {
    case 'getWordList':
      // get word list from the storage
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

      return;
    default:
      return;
  }
};

export default handleApi;

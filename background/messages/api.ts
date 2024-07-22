import type { AxiosResponse } from 'axios';
import axios from 'axios';
import type { Message } from '~types';

const handleApi = (
  message: Message,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => {
  switch (message.command) {
    case 'fetchSummary':
      // fetch summary
      (async () => {
        const url = message.data.url;
        // const response: AxiosResponse = await axios.get(
        //   `http://localhost:3000/scraped-contents`,
        //   {
        //     params: {
        //       url: url,
        //       isSummary: true,
        //       aoaiSummaryHeadingsLevel: [false, false, false],
        //       isTermDefinition: false
        //     }
        //   }
        // );
        const response = {
          aoaiOutputJson: {
            summary: 'This is a summary.',
            keywords: ['keyword1', 'keyword2']
          }
        };
        sendResponse(response.aoaiOutputJson);
      })();
    case 'fetchWordList':
      // fetch word list
      (async () => {
        const url = message.data.url;
        // const response: AxiosResponse = await axios.get(
        //   `http://localhost:3000/word-description/${url}`
        // );
        console.log(`fetchWordList: ${url}`);
        const response = ['Teams', 'Entra', 'チーム', 'チャネル', '多要素認証'];
        sendResponse({
          wordList: response
        });
      })();
      return;

    case 'fetchWordDescription':
      // fetch description of the word
      (async () => {
        const word = message.data.word;
        // const response: AxiosResponse = await axios.get(
        //   `http://localhost:3000/word-description/${word}`
        // );
        console.log(`fetchWordDescription: ${word}`);
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

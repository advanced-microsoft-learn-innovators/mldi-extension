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
        //       aoaiSummaryHeadingsLevel: [false, true, false],
        //       isTermDefinition: false
        //     }
        //   }
        // );
        const response = {
          aoaiOutputJson: {
            summary: 'This is a summary.',
            keywords: ['keyword1', 'keyword2']
          },
          aoaiOutputJsonHeadingById: {
            'guest-invitation-process':
              'This is a summary of guest-invitation-process',
            'set-up-guest-access': 'This is a summary of set-up-guest-access',
            'licensing-for-guest-access':
              'This is a summary of licensing-for-guest-access',
            'diagnosing-issues-with-guest-access':
              'This is a summary of diagnosing-issues-with-guest-access',
            'tracking-guests-in-your-organization':
              'This is a summary of tracking-guests-in-your-organization',
            'related-topics': 'This is a summary of related-topics'
          }
        };
        const [tab] = await chrome.tabs.query({
          active: true,
          lastFocusedWindow: true
        });
        await chrome.tabs.sendMessage(tab.id, {
          type: 'response',
          command: 'fetchSectionSummary',
          data: {
            sectionSummaries: response.aoaiOutputJsonHeadingById
          }
        });
        await chrome.tabs.sendMessage(tab.id, {
          type: 'response',
          command: 'fetchSummary',
          data: {
            summary: response.aoaiOutputJson.summary
          }
        });
      })();
    case 'fetchWordList':
      // fetch word list
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

    case 'fetchWordDescription':
      // fetch description of the word
      (async () => {
        const word = message.data.word;
        // const response: AxiosResponse = await axios.get(
        //   `http://localhost:3000/word-description/${word}`
        // );
        const response = {
          data: {
            description: `I cannot describe ${word}.`,
            tags: ['Teams', 'Microsoft365']
          },
          status: 200
        };
        sendResponse({
          description: response.data.description,
          tags: response.data.tags
        });
      })();
      return;
    default:
      return;
  }
};

export default handleApi;

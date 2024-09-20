import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { storage } from 'background';
import type { Message } from '~types';
import { getDocumentIds, sleep } from '~utils';

const handleApi = (
  message: Message,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => {
  switch (message.command) {
    case 'fetchSummary':
      // fetch summary
      (async () => {
        const [documentId, uuid] = getDocumentIds();
        console.log(documentId);
        const url = message.data.url;
        const headingLevel = '';
        const response: AxiosResponse = await axios.get(
          `${process.env.PLASMO_PUBLIC_BACKEND_DOMAIN}/documents/${documentId}/summary-contents/${uuid}`,
          {
            params: {
              url: url,
              aoaiSummayHeadingsLevel: headingLevel
            }
          }
        );
        const { data, status } = response;

        const [tab] = await chrome.tabs.query({
          active: true,
          lastFocusedWindow: true
        });
        await chrome.tabs.sendMessage(tab.id, {
          type: 'response',
          command: 'fetchSectionSummary',
          data: {
            sectionSummaries: data.aoaiOutputJsonHeadingById
          }
        });
        await chrome.tabs.sendMessage(tab.id, {
          type: 'response',
          command: 'fetchSummary',
          data: {
            summary: data.aoaiOutputJson
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
        const response = {
          data: {
            description: `I cannot describe ${word}.`,
            tags: ['Teams', 'Microsoft365']
          },
          status: 200
        };
        await sleep(1000);
        sendResponse({
          description: response.data.description,
          tags: response.data.tags
        });
      })();
      return;
    case 'getIsShowDescription':
      (async () => {
        const isShowDescription = await storage.get('isShowDescription');
        sendResponse(isShowDescription);
      })();
      return;
    default:
      return;
  }
};

export default handleApi;

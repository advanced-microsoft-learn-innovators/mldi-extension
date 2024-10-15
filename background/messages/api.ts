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
    case 'fetchDocument':
      // fetch document
      (async () => {
        const [tab] = await chrome.tabs.query({
          active: true,
          lastFocusedWindow: true
        });

        // load 'isSummaryHeadeingLevels' setting from storage
        const isSummaryHeadeingLevels = (await storage.get(
          'isSummaryHeadeingLevels'
        )) || { h2: false, h3: false, h4: false };

        // get document_id and uuid
        const res = await chrome.tabs.sendMessage(tab.id, {
          type: 'getContentData',
          command: 'getDocumentIds',
          data: {}
        });
        const documentId = res.documentId;
        const uuid = res.uuid;
        const url = res.url;

        // fetch contents
        const response: AxiosResponse = await axios.get(
          `${process.env.PLASMO_PUBLIC_BACKEND_DOMAIN}/documents/${documentId}/document-contents/${uuid}?url=${url}&summarySectionLevels=${isSummaryHeadeingLevels['h2']},${isSummaryHeadeingLevels['h3']},${isSummaryHeadeingLevels['h4']}`
        );

        switch (response.status) {
          case 200:
            // if the content exists and is latest.
            // send summary to content script
            let headingSummaries = {};
            if (response.data?.headingSection.length > 0) {
              console.log(response.data);
              // ensure data might be undefined
              response.data.headingSection.forEach((section) => {
                headingSummaries[section.id] = section.sectionSummary;
              });
            }

            await chrome.tabs.sendMessage(tab.id, {
              type: 'response',
              command: 'fetchSectionSummary',
              data: {
                sectionSummaries: headingSummaries
              }
            });
            await chrome.tabs.sendMessage(tab.id, {
              type: 'response',
              command: 'fetchSummary',
              data: {
                summary: response.data.mainSummary
              }
            });

            // TODO: send word description to content script

            break;
          case 404:
            // if the content does not exist or is not latest.
            const postResponse: AxiosResponse = await axios.post(
              `${process.env.PLASMO_PUBLIC_BACKEND_DOMAIN}/documents/${documentId}/document-contents`,
              {
                url: url,
                summarySectionLevels: isSummaryHeadeingLevels
              }
            );
            const { data, status } = postResponse;
            if (status === 201) {
              break;
            } else {
              console.error('Failed to create document content', status);
              break;
            }
          default:
            break;
        }
      })();
      return;
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

import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { storage } from 'background';
import type { Message } from '~types';
import { getDocumentIds, Logger, sleep } from '~utils';

const handleApi = (
  message: Message,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => {
  switch (message.command) {
    case 'fetchSummary':
      // fetch summary
      (async () => {
        // get document_id and uuid
        const [tab] = await chrome.tabs.query({
          active: true,
          lastFocusedWindow: true
        });
        const res = await chrome.tabs.sendMessage(tab.id, {
          type: 'getContentData',
          command: 'getDucumentIds',
          data: {}
        });
        const documentId = res.documentId;
        const uuid = res.uuid;

        // get url
        const url = message.data.url;

        // get heading level setting
        const isSummaryHeadeingLevels = (await storage.get(
          'isSummaryHeadeingLevels'
        )) || { h2: false, h3: false, h4: false };

        // cannot set summarySectionLevels parameter in "params", beacuse cannot set same key multiple times
        Logger.info(`documentId: ${documentId}`);
        Logger.info(`url: ${url}`);
        Logger.info(`uuid: ${uuid}`);
        Logger.info(
          `isSummaryHeadeingLevels.h2: ${isSummaryHeadeingLevels['h2']}`
        );
        Logger.info(
          `isSummaryHeadeingLevels.h3: ${isSummaryHeadeingLevels['h3']}`
        );
        Logger.info(
          `isSummaryHeadeingLevels.h4: ${isSummaryHeadeingLevels['h4']}`
        );
        Logger.info('fetchSummary');

        try {
          const response: AxiosResponse = await axios.get(
            `${process.env.PLASMO_PUBLIC_BACKEND_DOMAIN}/documents/${documentId}/summary-contents/${uuid}?url=${url}&summarySectionLevels=${isSummaryHeadeingLevels['h2']}&summarySectionLevels=${isSummaryHeadeingLevels['h3']}&summarySectionLevels=${isSummaryHeadeingLevels['h4']}`
          );
          const { data, status } = response;
          Logger.info(`status: ${status}`);
          let headingSummaries = {};
          if (data?.headingSection.length > 0) {
            // ensure data might be undefined
            data.headingSection.forEach((section) => {
              headingSummaries[section.id] = section.sectionSummary;
            });
          }

          await chrome.tabs.sendMessage(tab.id, {
            type: 'response',
            command: 'fetchSectionSummary',
            data: {
              status: status,
              sectionSummaries: headingSummaries
            }
          });
          await chrome.tabs.sendMessage(tab.id, {
            type: 'response',
            command: 'fetchSummary',
            data: {
              status: status,
              summary: data.mainSummary
            }
          });
        } catch (error) {
          Logger.error(`fetchSummary error: ${error}`);
          await chrome.tabs.sendMessage(tab.id, {
            type: 'response',
            command: 'fetchSectionSummary',
            data: {
              status: 500,
              sectionSummaries: {}
            }
          });
          await chrome.tabs.sendMessage(tab.id, {
            type: 'response',
            command: 'fetchSummary',
            data: {
              status: 500,
              summary: ''
            }
          });
        }

        Logger.info('fetchSummary response');
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
        Logger.info(`isShowDescription: ${isShowDescription}`);
        sendResponse(isShowDescription);
      })();
      return;
    default:
      return;
  }
};

export default handleApi;

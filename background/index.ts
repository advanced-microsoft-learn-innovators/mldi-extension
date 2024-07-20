import type { AxiosResponse } from 'axios';
import axios from 'axios';

import { convertJsonToResponseGetScrapedHtmlSummary } from '../common/convert-types';
import type {
  SwErrorResponse,
  SwRequestMessage,
  SwSuccessResponseApiRes,
  SwSuccessResponseTabId
} from '@advanced-microsoft-learn-innovators/mldi-types';

import showWordDescriptionCard from './contextMenus/word-description';
import { relayMessage } from './message/relay';
import type { Message } from '~types';
import { handleApi } from './message/api';

/**
 * Background script (service worker) for the extension.
 * To handle messaging between the extension and the content script, use Chrome Messaging API.
 * Because Plasmo messaging system is partially public alpha, it SHOULD NOT be used in the extension.
 */

// call from service worker
const callRESTApiNestJS = async (currentUrl: string) => {
  // send GET request to NestJS server to get summary
  const response: AxiosResponse = await axios.get(
    `http://localhost:3000/scraper/scraped-html/summary?url=${currentUrl}&isSummary=true&isSectionSummary=true&aoaiSummaryHeadingsLevel.h1s=false&aoaiSummaryHeadingsLevel.h2s=true&aoaiSummaryHeadingsLevel.h3s=false`
  );
  return response;
};

/**
 * Get the tabId of the sender (Content script).
 */
const getSenderTabId = (sender: chrome.runtime.MessageSender) => {
  return sender.tab.id;
};

/**
 * Listen for messages from the content script for all tabs.
 */
chrome.runtime.onMessage.addListener(
  async (message: SwRequestMessage, sender, sendResponse) => {
    try {
      if (message.requestType === 'getSenderTabId') {
        // get tabId and send it back to the content script
        const tabId = getSenderTabId(sender);
        const swResponse: SwSuccessResponseTabId = {
          isSuccess: true,
          status: 'ok',
          type: 'tabId',
          tabId: tabId
        };

        sendResponse(swResponse);
      } else if (message.requestType === 'callRESTApiNestJS') {
        // call REST API and send the response back to the content script
        const response = await callRESTApiNestJS(message.currentUrl);
        const responseGetScrapedHtmlSummary =
          convertJsonToResponseGetScrapedHtmlSummary(response.data);
        const swApiResResponse: SwSuccessResponseApiRes = {
          isSuccess: true,
          status: 'ok',
          type: 'apiRes',
          apiResponse: responseGetScrapedHtmlSummary
        };

        sendResponse(swApiResResponse);
      }
    } catch (error) {
      console.error(error);
      // send error message back to raise an error in the content script
      const swErrorResponse: SwErrorResponse = {
        isSuccess: false,
        status: 'error',
        error: error
      };
      // send swResponse back to the content script
      sendResponse(swErrorResponse);
    }
  }
);

// add contextMenu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'word-description',
    title: '単語の解説を表示する',
    contexts: ['selection']
  });
});

// add contextMenu clicked action
chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId === 'word-description') {
    console.log(1);
    showWordDescriptionCard(info);
  }
  return true;
});

// onMessage.addListener
chrome.runtime.onMessage.addListener(
  (message: Message, sender, sendResponse) => {
    switch (message.type) {
      case 'relay':
        relayMessage(message);
        return;
      case 'api':
        handleApi(message);
        return;
      default:
        console.log('a');
        return;
    }
  }
);

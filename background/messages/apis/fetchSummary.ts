import { Logger, sendMessage } from '~utils';
import { storage } from 'background';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import {
  MessageApiCommand,
  MessageToBrowserCommand,
  MessageType,
  type Message
} from '~types';

export const fetchSummary = async (message: Message) => {
  // get document_id and uuid
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  });
  const res = await sendMessage(true, {
    type: MessageType.TO_BROWSER,
    command: MessageToBrowserCommand.GET_DOCUMENT_IDS
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
  Logger.info(`isSummaryHeadeingLevels.h2: ${isSummaryHeadeingLevels['h2']}`);
  Logger.info(`isSummaryHeadeingLevels.h3: ${isSummaryHeadeingLevels['h3']}`);
  Logger.info(`isSummaryHeadeingLevels.h4: ${isSummaryHeadeingLevels['h4']}`);
  const restApiUrl = `${process.env.PLASMO_PUBLIC_BACKEND_DOMAIN}/documents/${documentId}/summary-contents/${uuid}?url=${url}&summarySectionLevels=${isSummaryHeadeingLevels['h2']}&summarySectionLevels=${isSummaryHeadeingLevels['h3']}&summarySectionLevels=${isSummaryHeadeingLevels['h4']}`;
  Logger.info(`restApiUrl: ${restApiUrl}`);
  const sendResponse = async (
    status: number,
    mainSummary: string,
    sectionSummaries: any
  ) => {
    await sendMessage(true, {
      type: MessageType.TO_BROWSER,
      command: MessageToBrowserCommand.FETCH_SUMMARY,
      data: {
        status: status,
        summary: mainSummary
      }
    });
    await sendMessage(true, {
      type: MessageType.TO_BROWSER,
      command: MessageToBrowserCommand.FETCH_SECTION_SUMMARIES,
      data: {
        status: status,
        sectionSummaries: sectionSummaries
      }
    });
  };

  try {
    const response: AxiosResponse = await axios.get(restApiUrl);
    const { data, status } = response;
    Logger.info(`status: ${status}`);
    let headingSummaries = {};
    if (data?.headingSection.length > 0) {
      // ensure data might be undefined
      data.headingSection.forEach((section) => {
        headingSummaries[section.id] = section.sectionSummary;
      });

      await sendResponse(status, data.mainSummary, headingSummaries);
    }
  } catch (error) {
    Logger.error(`fetchSummary error: ${error}`);
    await sendResponse(500, '', '');
  }

  Logger.info('fetchSummary response');
};

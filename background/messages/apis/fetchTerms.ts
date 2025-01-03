import { MessageToBrowserCommand, MessageType, type Message } from '~types';
import { Logger, sendMessage, sleep } from '~utils';
import axios from 'axios';
import { type AxiosResponse } from 'axios';

export const fetchTerms = async (sendResponse: (response?: any) => void) => {
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
  Logger.info(`documentId: ${documentId}`);
  Logger.info(`uuid: ${uuid}`);

  const restGetApiUrl = `${process.env.PLASMO_PUBLIC_BACKEND_DOMAIN}/documents/${documentId}/terms/${uuid}`;
  Logger.info(`restGetApiUrl: ${restGetApiUrl}`);

  try {
    // 1. try get terms
    const response: AxiosResponse = await axios.get(restGetApiUrl);
    const { data, status } = response;
    Logger.info(`get status: ${status}`);
    if (status === 404) {
      // 2. if 404, try create terms
      const restPostApiUrl = `${process.env.PLASMO_PUBLIC_BACKEND_DOMAIN}/documents/${documentId}/terms`;
      Logger.info(`restPostApiUrl: ${restPostApiUrl}`);
      const response: AxiosResponse = await axios.post(restPostApiUrl, {
        uuid: uuid
      });
      const postStatus = response.status;
      if (postStatus === 201) {
        // 3. wait for terms to be created
        while (true) {
          const response: AxiosResponse = await axios.get(restGetApiUrl);
          const getStatus = response.status;
          Logger.info(`get status: ${getStatus}`);
          if (getStatus === 200) {
            break;
          }
          await sleep(5000);
        }
      } else {
        Logger.error(`create terms error: ${postStatus}`);
        return;
      }
    }

    // 4. send terms
    sendResponse({
      wordList: response
    });
  } catch (error) {
    Logger.error(`fetchWordList error: ${error}`);
  }
};

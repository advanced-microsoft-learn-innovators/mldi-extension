import { MessageToBrowserCommand, MessageType, type Message } from '~types';
import { Logger, sendMessage, sleep } from '~utils';
import axios from 'axios';
import { type AxiosResponse } from 'axios';

const fetchTerms = async (
  message: Message,
  sendResponse: (response?: any) => void
) => {
  // get document_id and uuid
  const res = await sendMessage(true, {
    type: MessageType.TO_BROWSER,
    command: MessageToBrowserCommand.GET_DOCUMENT_IDS
  });
  const documentId = res.documentId;
  const uuid = res.uuid;
  Logger.info(`documentId: ${documentId}`);
  Logger.info(`uuid: ${uuid}`);

  const url = message.data.url.split('#')[0];

  const restGetApiUrl = `${process.env.PLASMO_PUBLIC_BACKEND_DOMAIN}/documents/${documentId}/terms/${uuid}?url=${url}`;
  Logger.info(`restGetApiUrl: ${restGetApiUrl}`);

  try {
    // 1. try get terms
    const response: AxiosResponse = await axios.get(restGetApiUrl);
    const { data, status } = response;
    Logger.info(`get status: ${status}`);

    // 2. if there is no error, send response
    sendResponse({
      wordList: response
    });
  } catch (error) {
    if (error.response.status === 404) {
      // 2. if 404, try create terms
      const restPostApiUrl = `${process.env.PLASMO_PUBLIC_BACKEND_DOMAIN}/documents/${documentId}/terms`;
      Logger.info(`restPostApiUrl: ${restPostApiUrl}`);
      try {
        const response: AxiosResponse = await axios.post(restPostApiUrl, {
          url: url
        });
        Logger.info(
          `Terms creation request sent successfully.: ${response.status}`
        );
      } catch (error) {
        if (error.response.status === 409) {
          Logger.info(`Terms are already created.`);
        } else {
          Logger.error(`post terms creation request: ${error}`);
          sendResponse({
            wordList: []
          });
          return;
        }
      }

      // 3. wait for terms to be created
      while (true) {
        try {
          const response: AxiosResponse = await axios.get(restGetApiUrl);
          if (response.status === 200) {
            sendResponse({
              wordList: response
            });
            break;
          }
        } catch (error) {
          if (error.response.status === 404) {
            Logger.info(`Terms are not created yet. Wait for 5 seconds.`);
            await sleep(5000);
            continue;
          } else {
            Logger.error(`fetch Terms error: ${error}`);
            return;
          }
        }
      }
    } else {
      Logger.error(`fetch Terms error: ${error}`);
      return;
    }
  }
};

export default fetchTerms;

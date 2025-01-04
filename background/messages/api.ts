import { storage } from 'background';
import { MessageApiCommand, type Message } from '~types';
import { Logger } from '~utils';
import fetchSummary from './apis/fetchSummary';
import fetchTerms from './apis/fetchTerms';

const handleApi = (
  message: Message,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => {
  switch (message.command) {
    case MessageApiCommand.FETCH_SUMMARY:
      // fetch summary
      (async () => {
        await fetchSummary(message);
      })();
      return;
    case MessageApiCommand.FETCH_TERMS:
      // fetch terms
      (async () => {
        await fetchTerms(message, sendResponse);
      })();
      return;
    case MessageApiCommand.GET_IS_SHOW_DESCRIPTION:
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

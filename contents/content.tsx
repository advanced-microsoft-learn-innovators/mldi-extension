import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from 'plasmo';
import type { SwResponse } from '@advanced-microsoft-learn-innovators/mldi-types';

export const config: PlasmoCSConfig = {
  matches: ['https://learn.microsoft.com/*']
};

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => ({
  element: document.getElementsByTagName('h1')[0],
  position: 'afterend'
});

/**
 * Get the tab ID.
 * @param callback
 */
const getSenderTabId = (callback: (tabId: number) => void) => {
  chrome.runtime.sendMessage(
    { requestType: 'getSenderTabId' },
    (response: SwResponse) => {
      if (response.isSuccess && response.type === 'tabId') {
        callback(response.tabId);
      } else if (response.isSuccess && response.type !== 'tabId') {
        //error
        console.error('Invalid response type');
      } else {
        // error
        console.error(response);
      }
    }
  );
};

/**
 * Get the API response.
 * @param callback
 * @param currentUrl
 * @param senderTabId
 */
const getApiRes = (
  callback: (apiResponse: any) => void,
  currentUrl: string,
  senderTabId: number
) => {
  // send message to background SW to call Rest API
  chrome.runtime.sendMessage(
    {
      requestType: 'callRESTApiNestJS',
      currentUrl: currentUrl,
      senderTabId: senderTabId
    },
    (response: SwResponse) => {
      if (response.isSuccess && response.type === 'apiRes') {
        callback(response.apiResponse);
      } else if (response.isSuccess && response.type !== 'apiRes') {
        // error
        console.error('Invalid response type');
      } else {
        // error
        console.error(response);
      }
    }
  );
};

/**
 * Injest the JSX elmement for the Plasmo inline (React component).
 * @returns
 */
const PlasmoInline = () => {
  const handleClick = () => {
    // get current url
    const currentUrl = window.location.href;
    getSenderTabId((senderTabId) => {
      getApiRes(
        (apiResponse) => {
          console.log(apiResponse);
        },
        currentUrl,
        senderTabId
      );
    });
  };

  return (
    <div
      style={{
        borderRadius: 4,
        padding: 4,
        background: 'pink'
      }}
    >
      <button onClick={handleClick}>Toggle REST API via background SW</button>
    </div>
  );
};

export default PlasmoInline;

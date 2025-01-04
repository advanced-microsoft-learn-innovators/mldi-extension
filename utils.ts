import type { Message } from '~types';

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getDocumentIds = () => {
  const headChildren = document.head.children;
  let documentId = '';
  let uuid = '';

  for (var i = 0; i < headChildren.length; i++) {
    var tmp = headChildren[i].getAttribute('name');
    if (tmp === 'document_id') {
      documentId = headChildren[i].textContent;
    } else if (tmp === 'document_version_independent_id') {
      uuid = headChildren[i].textContent;
    }
  }
  return [documentId, uuid];
};

const LogCaller = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = (...args: any[]) => {
      const error = new Error();
    };
  };
};

export class Logger {
  private static getCaller() {
    const error = new Error();
    const stack = error.stack;
    if (stack) {
      const stackLines = stack.split('\n');
      const callerLine = stackLines[3];
      const callerFunction = callerLine.match(/at (\w+)/);
      if (callerFunction && callerFunction[1]) {
        return callerFunction[1];
      }
    }
    return 'unknown';
  }

  public static info(message: string) {
    const caller = Logger.getCaller();
    console.log(`[INF] ${caller} ${message}`);
  }

  public static error(message: string) {
    const caller = Logger.getCaller();
    console.error(`[ERR] ${caller} ${message}`);
  }
}

/**
 *
 * @param isBackground: If you send message from background, set this to true
 * @param message: Message
 * @returns
 */
export const sendMessage = async (isBackground: boolean, message: Message) => {
  if (isBackground) {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    });
    return await chrome.tabs.sendMessage(tab.id, message);
  } else {
    return await chrome.runtime.sendMessage(message);
  }
};

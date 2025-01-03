import { MessageType, type Message } from '~types';
import { sendMessage } from '~utils';

const handleRelay = (message: Message) => {
  if (message.type !== MessageType.RELAY) return;
  (async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    });
    const msg: Message = {
      type: MessageType.RELAY,
      command: message.command,
      data: message.data
    };
    const result = await sendMessage(true, msg);
  })();
};

export default handleRelay;

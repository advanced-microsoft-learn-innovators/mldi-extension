import type { Message } from '~types';

const handleRelay = (message: Message) => {
  console.log('relay');
  if (message.type !== 'relay') return;
  (async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    });
    const msg: Message = {
      type: 'relay',
      command: message.command,
      data: message.data
    };
    const result = await chrome.tabs.sendMessage(tab.id, msg);
    console.log(result);
  })();
};

export default handleRelay;

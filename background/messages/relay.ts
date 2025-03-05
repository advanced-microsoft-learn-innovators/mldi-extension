import { MessageType, type Message } from '~types';
import { Logger, sendMessage } from '~utils';

const handleRelay = (message: Message) => {
  if (message.type !== MessageType.RELAY) return;
  (async () => {
    const msg: Message = {
      type: MessageType.RELAY,
      command: message.command,
      data: message.data
    };
    const result = await sendMessage(true, msg);
    Logger.info(`result: ${result}`);
  })();
};

export default handleRelay;

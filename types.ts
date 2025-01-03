// Todo: make the type name more specific
export type Message = {
  type: MessageType;
  command: MessageApiCommand;
  data?: any;
};

export enum MessageType {
  API = 'api',
  RELAY = 'relay',
  CONTEXT_MENU = 'contextMenu'
}

export enum MessageApiCommand {
  FETCH_SUMMARY = 'fetchSummary',
  FETCH_TERMS = 'fetchTerms',
  GET_IS_SHOW_DESCRIPTION = 'getIsShowDescription'
}

export enum MessageContextMenuCommand {
  GET_RECT = 'getRect',
  SHOW_CARD = 'showCard',
  SET_TIMEOUT = 'setTimeout'
}

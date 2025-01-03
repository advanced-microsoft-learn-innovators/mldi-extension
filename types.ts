// Todo: make the type name more specific
export type Message = {
  type: MessageType;
  command: MessageApiCommand;
  data?: any;
};

export enum MessageType {
  API,
  RELAY,
  CONTEXT_MENU
}

export enum MessageApiCommand {
  FETCH_SUMMARY,
  FETCH_TERMS,
  GET_IS_SHOW_DESCRIPTION
}

export enum MessageContextMenuCommand {
  GET_RECT,
  SHOW_CARD,
  SET_TIMEOUT
}

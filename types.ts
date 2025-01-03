// Todo: make the type name more specific
export type Message = {
  type: MessageType;
  command: MessageCommand;
  data?: any;
};

export enum MessageType {
  API,
  RELAY,
  CONTEXT_MENU,
  TO_BROWSER
}

export type MessageCommand =
  | MessageApiCommand
  | MessageContextMenuCommand
  | MessageRelayCommand
  | MessageToBrowserCommand;

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

export enum MessageRelayCommand {
  SHOW_CARD,
  HIDE_CARD,
  SET_TIMEOUT,
  DELETE_TIMEOUT
}

export enum MessageToBrowserCommand {
  GET_DOCUMENT_IDS,
  FETCH_SUMMARY,
  FETCH_SECTION_SUMMARIES,
  FETCH_TERMS
}

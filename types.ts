// Todo: make the type name more specific
export type Message = {
  type: 'api' | 'relay' | 'contextMenu';
  command: string;
  data?: any;
};

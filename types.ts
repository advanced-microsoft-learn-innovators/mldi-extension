export type Message = {
  type: 'api' | 'relay' | 'contextMenu';
  command: string;
  data?: any;
};

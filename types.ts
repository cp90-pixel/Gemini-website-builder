export enum ViewMode {
  Preview = 'preview',
  Code = 'code',
}

export interface ChatMessagePart {
  text: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: ChatMessagePart[];
}

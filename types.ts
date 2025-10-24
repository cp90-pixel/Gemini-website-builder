export enum ViewMode {
  Preview = 'preview',
  Code = 'code',
}

export type ChatMessagePart =
  | { text: string; inlineData?: never }
  | {
      text?: never;
      inlineData: {
        mimeType: 'image/jpeg';
        data: string; // base64 string without data URL prefix
      };
    };

export interface ChatMessage {
  role: 'user' | 'model';
  parts: ChatMessagePart[];
}

export interface CollaborationMessageRequest {
  type: CollaborationMessageTypeRequest;
  novelId: number;
  userId: number;
  messageId?: number;
  content?: string;
}

export interface CollaborationMessageResponse {
  type: CollaborationMessageTypeResponse;
  userId?: number;
  userIds?: number[];
  messageId?: number;
  content?: string;
}

export enum CollaborationMessageTypeRequest {
  JoinNovel = 'joinNovel',
  LeaveNovel = 'leaveNovel',
  EditNovel = 'editNovel',
  SendMessageInChat = 'sendMessageInChat',
}

export enum CollaborationMessageTypeResponse {
  EditNovel = 'editNovel',
  SendMessageInChat = 'sendMessageInChat',
  UpdateOnlineUsers = 'updateOnlineUsers',
}

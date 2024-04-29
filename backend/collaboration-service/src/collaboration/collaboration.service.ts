import { Injectable, Logger } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';
import { WebSocket } from 'ws';
import {
  CollaborationMessageRequest,
  CollaborationMessageResponse,
  CollaborationMessageTypeRequest,
  CollaborationMessageTypeResponse,
} from './collaboration-api.models';

@Injectable()
@WebSocketGateway()
export class CollaborationService {
  private readonly logger = new Logger(CollaborationService.name);
  private clients: { [novelId: number]: Client[] } = {};

  handleDisconnect(ws: WebSocket) {
    for (const novelId in this.clients) {
      if (this.clients.hasOwnProperty(novelId)) {
        const disconnectingClient = this.clients[novelId].find(
          (client) => client.ws === ws,
        );
        if (disconnectingClient) {
          const req: CollaborationMessageRequest = {
            type: CollaborationMessageTypeRequest.LeaveNovel,
            novelId: Number(novelId),
            userId: disconnectingClient.userId,
          };
          this.handleMessage(disconnectingClient.ws, JSON.stringify(req));
          break;
        }
      }
    }
  }

  handleMessage(ws: WebSocket, message: string) {
    try {
      const req: CollaborationMessageRequest = JSON.parse(message);

      switch (req.type) {
        case CollaborationMessageTypeRequest.JoinNovel:
          this.handleJoinNovel(ws, req);
          break;
        case CollaborationMessageTypeRequest.LeaveNovel:
          this.handleLeaveNovel(ws, req);
          break;
        case CollaborationMessageTypeRequest.EditNovel:
          this.handleEditNovel(ws, req);
          break;
        case CollaborationMessageTypeRequest.SendMessageInChat:
          this.handleSendMessageInChat(ws, req);
          break;
        default:
          this.logger.log('Unknown req type');
          break;
      }
    } catch (error) {
      this.logger.error('Error parsing message:', error);
    }
  }

  private handleJoinNovel(ws: WebSocket, req: CollaborationMessageRequest) {
    const newClient = new Client(ws, req.userId);
    if (!this.clients[req.novelId]) {
      this.clients[req.novelId] = [];
    }
    this.clients[req.novelId].push(newClient);
    const userIds = this.clients[req.novelId].map((client) => client.userId);
    this.updateOnlineUsers(req.novelId, userIds);
  }

  private handleLeaveNovel(ws: WebSocket, req: CollaborationMessageRequest) {
    if (this.clients[req.novelId]) {
      this.clients[req.novelId] = this.clients[req.novelId].filter(
        (clientItem) => clientItem.ws !== ws,
      );
      const userIds = this.clients[req.novelId].map((client) => client.userId);
      this.updateOnlineUsers(req.novelId, userIds);
    }
  }

  private handleEditNovel(ws: WebSocket, req: CollaborationMessageRequest) {
    const res: CollaborationMessageResponse = {
      type: CollaborationMessageTypeResponse.EditNovel,
      userId: req.userId,
      content: req.content,
    };

    this.sendDataToClients(req.novelId, res, ws);
  }

  private handleSendMessageInChat(
    ws: WebSocket,
    req: CollaborationMessageRequest,
  ) {
    const res: CollaborationMessageResponse = {
      type: CollaborationMessageTypeResponse.SendMessageInChat,
      userId: req.userId,
      messageId: req.messageId,
    };

    this.sendDataToClients(req.novelId, res, ws);
  }

  private sendDataToClients(
    novelId: number,
    res: CollaborationMessageResponse,
    wsToOmit?: WebSocket,
  ) {
    if (this.clients[novelId]) {
      this.clients[novelId].forEach((client) => {
        if (client.ws !== wsToOmit && client.ws.readyState === WebSocket.OPEN) {
          client.ws.send(JSON.stringify(res));
        }
      });
    }
  }

  private updateOnlineUsers(novelId: number, userIds: number[]) {
    const res: CollaborationMessageResponse = {
      type: CollaborationMessageTypeResponse.UpdateOnlineUsers,
      userIds: userIds,
    };

    this.sendDataToClients(novelId, res);
  }
}

class Client {
  constructor(
    public ws: WebSocket,
    public userId: number,
  ) {}
}

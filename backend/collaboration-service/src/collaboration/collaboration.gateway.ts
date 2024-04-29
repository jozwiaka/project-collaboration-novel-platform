import { WebSocketServer, WebSocketGateway } from '@nestjs/websockets';
import { CollaborationService } from './collaboration.service';
import { Logger } from '@nestjs/common';
import { WebSocket, Server } from 'ws';

@WebSocketGateway()
export class CollaborationGateway {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(CollaborationGateway.name);

  constructor(private readonly collaborationService: CollaborationService) {}

  handleConnection(client: WebSocket) {
    this.logger.log('Client connected');
    client.on('message', (message: string) => {
      this.collaborationService.handleMessage(client, message);
    });
  }

  handleDisconnect(client: WebSocket) {
    this.logger.log('Client disconnected');
    this.collaborationService.handleDisconnect(client);
  }
}

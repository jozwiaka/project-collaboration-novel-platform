import { Module } from '@nestjs/common';
import { CollaborationService } from './collaboration.service';
import { CollaborationGateway } from './collaboration.gateway';

@Module({
  providers: [CollaborationService, CollaborationGateway],
  controllers: [],
})
export class CollaborationModule {}

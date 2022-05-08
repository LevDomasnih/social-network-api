import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesRepository } from '@app/nest-postgre';

@Module({
  controllers: [MessagesController],
  imports: [
      TypeOrmModule.forFeature([MessagesRepository])
  ],
  exports: [MessagesService],
  providers: [MessagesService]
})
export class MessagesModule {}

import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesEntity } from './messages.entity';

@Module({
  controllers: [MessagesController],
  imports: [
      TypeOrmModule.forFeature([MessagesEntity])
  ],
  exports: [MessagesService],
  providers: [MessagesService]
})
export class MessagesModule {}

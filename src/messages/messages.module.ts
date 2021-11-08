import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { MessagesModel } from './messages.model';

@Module({
  controllers: [MessagesController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: MessagesModel,
        schemaOptions: {
          collection: 'Messages'
        }
      }
    ])
  ],
  exports: [MessagesService],
  providers: [MessagesService]
})
export class MessagesModule {}

import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
    controllers: [MessagesController],
    imports: [],
    exports: [MessagesService],
    providers: [MessagesService],
})
export class MessagesModule {
}

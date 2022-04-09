import { Injectable } from '@nestjs/common';
import { MessagesEntity } from './messages.entity';
import { MessagesRepository } from './messages.repository';

@Injectable()
export class MessagesService {
    constructor(
        private readonly messagesRepository: MessagesRepository,
    ) {
    }

    async createMessage(data: MessagesEntity) {
        return this.messagesRepository.save(data);
    }
}

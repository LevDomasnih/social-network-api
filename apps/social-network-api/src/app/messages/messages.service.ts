import { Injectable } from '@nestjs/common';
import { MessagesEntity, MessagesRepository } from '@app/nest-postgre';

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

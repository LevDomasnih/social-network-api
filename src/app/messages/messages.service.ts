import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessagesEntity } from './messages.entity';

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(MessagesEntity) private readonly messagesRepository: Repository<MessagesEntity>,
    ) {
    }

    async createMessage(data: MessagesEntity) {
        return this.messagesRepository.save(data);
    }
}

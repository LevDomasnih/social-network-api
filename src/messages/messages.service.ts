import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { MessagesModel } from './messages.model';

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel(MessagesModel) private readonly messagesModel: ModelType<MessagesModel>,
    ) {}

    async createMessage(data: Omit<MessagesModel, 'id' | '_id'>) {
        return this.messagesModel.create(data)
    }
}

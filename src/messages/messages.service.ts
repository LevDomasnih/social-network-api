import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { MessagesModel } from './messages.model';
import { CreateDialogRequestDto } from '../dialogs/dto/create-dialog-request.dto';
import { Types } from 'mongoose';

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel(MessagesModel) private readonly messagesModel: ModelType<MessagesModel>,
    ) {}

    async createMessage(ownerId: Types.ObjectId, dto: Omit<CreateDialogRequestDto, 'otherOwners'>) {
        return this.messagesModel.create({
            ownerId,
            ...dto
        })
    }
}

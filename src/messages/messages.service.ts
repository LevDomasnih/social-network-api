import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { MessagesModel } from './messages.model';
import { CreateDialogDto } from '../dialogs/dto/create-dialog.dto';
import { Types } from 'mongoose';

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel(MessagesModel) private readonly messagesModel: ModelType<MessagesModel>,
    ) {}

    async createMessage(ownerId: Types.ObjectId, dto: Omit<CreateDialogDto, 'otherOwners'>) {
        return this.messagesModel.create({
            ownerId,
            ...dto
        })
    }
}

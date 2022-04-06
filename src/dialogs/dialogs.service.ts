import { BadRequestException, Injectable } from '@nestjs/common';
import { DialogsModel } from './dialogs.model';
import { AuthService } from '../auth/auth.service';
import { CreateDialogRequestDto } from './dto/create-dialog-request.dto';
import { MessagesService } from '../messages/messages.service';
import { UserModel } from '../users/user.model';
import { Types } from 'mongoose';
import { MessagesModel } from '../messages/messages.model';
import { UpdateOwnersRequestDto } from './dto/update-owners-request.dto';
import { UpdateDialogResponseDto } from './dto/update-dialog-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../users/user.entity';
import { Repository } from 'typeorm';
import { MessagesEntity } from '../messages/messages.entity';
import { DialogsRepository } from './dialogs.repository';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class DialogsService {
    constructor(
        private readonly dialogsRepository: DialogsRepository,
        private readonly userRepository: UsersRepository,
        @InjectRepository(MessagesEntity) private readonly messagesRepository: Repository<MessagesEntity>,
        private readonly authService: AuthService,
        private readonly messagesService: MessagesService,
    ) {
    }

    async validateOwners(owners: string[]) {
        return this.userRepository.find({ where: owners.map(id => ({ id })) })
    }

    async createDialog(user: UserEntity, { otherOwners, ...messageData }: CreateDialogRequestDto) {
        try {
            const owner = await this.userRepository.findOne(user.id)

            if (!owner) {
                return new BadRequestException(`Пользователя ${user.id} не существует`)
            }

            const validOwners = await this.validateOwners([user.id, ...otherOwners]);

            const newDialog = await this.dialogsRepository.save({
                owners: validOwners
            });

            const newMessage = await this.messagesRepository.save(
                { owner, dialog: newDialog, ...messageData },
            );

            return newMessage;

        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    async getDialogs(user: UserEntity) {
        try {
            return this.dialogsRepository.getDialogsByUserId(user.id)
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    async getDialog(user: UserEntity, id: string) {
        try {
            const dialog = await this.dialogsRepository.getDialogsById(user.id, id)

            if (Object.keys(dialog).length === 0) {
                return new BadRequestException('Диалога не существует');
            }

            return dialog;

        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    async updateDialog(user: UserEntity, { dialogId, ...dto }: UpdateDialogResponseDto) {
        // try {
        //     const newMessage = await this.messagesService.createMessage(
        //         { ownerId: user._id, dialog: dialogId, ...dto },
        //     );
        //
        //     const dialogs = await this.dialogsModel.findOneAndUpdate(
        //         { _id: dialogId },
        //         { $push: { messages: newMessage } },
        //         { new: true },
        //     ).exec();
        //
        //     if (!dialogs) {
        //         throw new BadRequestException('Диалога нет');
        //     }
        //
        //     const owners = dialogs.owners.map(e => e!.toString());
        //
        //     return {
        //         newMessage,
        //         owners: owners as unknown as string[],
        //     };
        // } catch (e) {
        //     throw new BadRequestException(e);
        // }
    }

    async updateDialogOwners(user: UserEntity, { dialogId, owners }: UpdateOwnersRequestDto) {
        // try {
        //     const oldDialog = await this.dialogsModel.findById(dialogId);
        //
        //     if (!oldDialog) {
        //         throw new BadRequestException('Диалога не существует');
        //     }
        //
        //     const updatedOwners = await this.validateOwners([user._id, ...owners]);
        //
        //     await this.userModel.updateMany(
        //         { dialogs: { $in: [oldDialog] } },
        //         { $pull: { dialogs: dialogId } },
        //         { multi: true },
        //     );
        //
        //     await this.userModel.updateMany(
        //         { _id: { $in: updatedOwners } },
        //         { $push: { dialogs: dialogId } },
        //         { multi: true },
        //     );
        //
        //     const updatedDialog = await this.dialogsModel
        //         .findOneAndUpdate(
        //             { _id: dialogId, owners: { $in: [user._id] } },
        //             { owners: updatedOwners },
        //             { new: true },
        //         )
        //         .populate({ path: 'owners', model: UserModel, select: 'name surname' });
        //
        //     if (!updatedDialog) {
        //         throw new BadRequestException('Диалога не существует');
        //     }
        //
        //     return updatedDialog;
        //
        // } catch (e) {
        //     throw new BadRequestException(e);
        // }
    }
}

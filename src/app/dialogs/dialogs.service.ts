import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDialogRequestDto } from './dto/create-dialog-request.dto';
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
    ) {
    }

    async validateOwners(owners: string[]) {
        return this.userRepository.find({ where: owners.map(id => ({ id })) });
    }

    async createDialog(user: UserEntity, { otherOwners, ...messageData }: CreateDialogRequestDto) {
        const owner = await this.userRepository.findOne(user.id);
        if (!owner) {
            throw new BadRequestException(`Пользователя ${user.id} не существует`);
        }
        const validOwners = await this.validateOwners([user.id, ...otherOwners]);
        const newDialog = await this.dialogsRepository.save({
            owners: validOwners,
        });
        return this.messagesRepository.save(
            { owner, dialog: newDialog, ...messageData },
        );
    }

    async getDialogs(user: UserEntity) {
        try {
            return this.dialogsRepository.getDialogsByUserId(user.id);
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    async getDialog(user: UserEntity, id: string) {
        const dialog = await this.dialogsRepository.getDialogsById(user.id, id);
        if (Object.keys(dialog).length === 0) {
            throw new BadRequestException('Диалога не существует');
        }
        return dialog;
    }

    async updateDialog(user: UserEntity, { dialogId, ...dto }: UpdateDialogResponseDto) {
        const dialog = await this.dialogsRepository.findOne({ id: dialogId });
        if (!dialog) {
            throw new BadRequestException(`Диалог ${dialogId} отсутствует`);
        }
        const owner = await this.userRepository.findOne(user.id);
        if (!owner) {
            throw new BadRequestException(`Юзер ${user.id} отсутствует`);
        }
        const newMessage = await this.messagesRepository.save(
            { owner, dialog, ...dto },
        );
        return {
            newMessage,
            owners: dialog.owners,
        };
    }

    async updateDialogOwners(user: UserEntity, { dialogId, owners }: UpdateOwnersRequestDto) {
        const oldDialog = await this.dialogsRepository.findOne({ id: dialogId });
        if (!oldDialog) {
            throw new BadRequestException('Диалога не существует');
        }
        const updatedOwners = await this.validateOwners([user.id, ...owners]);
        const updatedDialog = await this.dialogsRepository.update({ id: dialogId }, { owners: updatedOwners });
        if (!updatedDialog.affected) {
            throw new BadRequestException('Диалог не обновился');
        }
        return this.dialogsRepository.findOne({ id: dialogId }, { relations: ['owners'] });
    }
}

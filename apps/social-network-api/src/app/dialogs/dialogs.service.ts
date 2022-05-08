import { BadRequestException, Injectable } from '@nestjs/common';
import { DialogsRepository, MessagesRepository, UserEntity, UsersRepository } from '@app/nest-postgre';
import {
    CreateDialogRequestDto,
    CreateDialogResponseDto,
    GetDialogResponseDto,
    GetDialogsResponseDto,
    UpdateDialogRequestDto,
    UpdateDialogResponseDto,
    UpdateOwnersRequestDto,
    UpdateOwnersResponseDto,
} from './dto';

@Injectable()
export class DialogsService {
    constructor(
        private readonly dialogsRepository: DialogsRepository,
        private readonly userRepository: UsersRepository,
        private readonly messagesRepository: MessagesRepository,
    ) {
    }

    async validateOwners(owners: string[]) {
        return this.userRepository.find({ where: owners.map(id => ({ id })) });
    }

    async createDialog(user: UserEntity, {
        otherOwners,
        ...messageData
    }: CreateDialogRequestDto): Promise<CreateDialogResponseDto> {
        const owner = await this.userRepository.findOne(user.id);
        if (!owner) {
            throw new BadRequestException(`Пользователя ${user.id} не существует`);
        }
        const validOwners = await this.validateOwners([user.id, ...otherOwners]);
        const newDialog = await this.dialogsRepository.save({
            owners: validOwners,
        });
        return this.messagesRepository.saveAndGet(
            { owner, dialog: newDialog, ...messageData },
        );
    }

    async getDialogs(user: UserEntity): Promise<GetDialogsResponseDto[]> {
        try {
            return this.dialogsRepository.getDialogsByUserId(user.id);
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    async getDialog(user: UserEntity, id: string): Promise<{} | GetDialogResponseDto> {
        const dialog = await this.dialogsRepository.getDialogsById(user.id, id);
        if (Object.keys(dialog).length === 0) {
            throw new BadRequestException('Диалога не существует');
        }
        return dialog;
    }

    async updateDialog(
        user: UserEntity,
        { dialogId, ...dto }: UpdateDialogRequestDto,
    ): Promise<UpdateDialogResponseDto> {
        const dialog = await this.dialogsRepository.findOne({ id: dialogId });
        if (!dialog) {
            throw new BadRequestException(`Диалог ${dialogId} отсутствует`);
        }
        const owner = await this.userRepository.findOne(user.id);
        if (!owner) {
            throw new BadRequestException(`Юзер ${user.id} отсутствует`);
        }
        const newMessage = await this.messagesRepository.saveAndGet(
            { owner, dialog, ...dto },
        );
        return {
            newMessage,
            owners: dialog.owners,
        };
    }

    async updateDialogOwners(
        user: UserEntity,
        { dialogId, owners }: UpdateOwnersRequestDto,
    ): Promise<UpdateOwnersResponseDto | undefined> {
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

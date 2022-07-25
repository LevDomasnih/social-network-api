import { BadRequestException, Injectable } from '@nestjs/common';
import { DialogsRepository, DialogType, MessagesRepository, UserEntity, UsersRepository } from '@app/nest-postgre';
import {
    CreateDialogRequestDto, CreateDialogResponseDto,
    GetDialogResponseDto,
    GetDialogsResponseDto,
    UpdateDialogRequestDto,
    UpdateDialogResponseDto,
    UpdateOwnersRequestDto,
    UpdateOwnersResponseDto,
} from './dto';
import { FindManyOptions } from 'typeorm';

@Injectable()
export class DialogsService {
    constructor(
        private readonly dialogsRepository: DialogsRepository,
        private readonly userRepository: UsersRepository,
        private readonly messagesRepository: MessagesRepository,
    ) {
    }

    async validateOwners(owners: string[], options?: FindManyOptions<UserEntity>) {
        return this.userRepository.find({ where: owners.map(id => ({ id })), ...options });
    }

    async findDialogId(ownerId: string, secondOwnerId: string) {
        const owner = await this.userRepository.findOne(ownerId);
        const secondOwner = await this.userRepository.findOne(secondOwnerId);
        if (!owner || !secondOwner) {
            throw new BadRequestException(`Пользователя не существует`);
        }
        const user = await this.userRepository.findOne({
            relations: ['dialogs', 'dialogs.owners'],
            where: {id: owner.id}
        })
        if (!user) {
            throw new BadRequestException(`Пользователя ${owner.id} не существует`)
        }
        let dialogId = null;
        user.dialogs.forEach(dialog => dialog.owners.forEach(userOwner => {
            if (userOwner.id === secondOwner.id) {
                dialogId = dialog.id
            }
        }))
        return dialogId
    }

    // async sendMessageInDialog(user: UserEntity, {
    //     secondOwnerId,
    //     ...messageData
    // }: CreateDialogRequestDto)/*: Promise<CreateDialogResponseDto | UpdateDialogResponseDto> */{
    //     const owner = await this.userRepository.findOne(user.id);
    //     const secondOwner = await this.userRepository.findOne(secondOwnerId);
    //     if (!owner || !secondOwner) {
    //         throw new BadRequestException(`Пользователя ${user.id} не существует`);
    //     }
    //     const dialogId = await this.findDialogId(owner, secondOwner)
    //     if (dialogId) {
    //         return this.updateDialog(user, {dialogId, ...messageData})
    //     }
    //     return this.createDialog(owner, { secondOwnerId, ...messageData })
    // }

    async createDialog(user: UserEntity, {
        secondOwnerId,
        ...messageData
    }: CreateDialogRequestDto) {
        const owner = await this.userRepository.findOne(
            user.id,
            {relations: ['profile', 'profile.avatar']}
        );
        const secondOwner = await this.userRepository.findOne(
            secondOwnerId,
            {relations: ['profile', 'profile.avatar']}
        );
        const validOwners = await this.validateOwners(
            [user.id, secondOwnerId],
            {relations: ['profile', 'profile.avatar']}
        );
        if (!validOwners || !owner || !secondOwner) {
            throw new BadRequestException(`Пользователя не существует`);
        }
        const newDialog = await this.dialogsRepository.save({
            owners: validOwners,
        });
        const message = await this.messagesRepository.saveAndGet(
            { owner, dialog: newDialog, ...messageData },
        );

        return [
            {
                to: owner.id,
                dialog: {
                    id: newDialog.id,
                    messages: [{
                        ...message,
                        ownerId: owner.id,
                        dialogId: newDialog.id
                    }],
                    status: 'CHAT',
                    info: {
                        id: secondOwner.id,
                        image: secondOwner.profile.avatar?.getFilePath() || null,
                        name: secondOwner.profile.firstName + ' ' + secondOwner.profile.lastName
                    },
                    users: validOwners.map(validOwner => ({
                        avatar: validOwner.profile.avatar?.getFilePath() || null,
                        firstName: validOwner.profile.firstName,
                        id: validOwner.id,
                        lastName: validOwner.profile.lastName,
                    }))
                }
            },
            {
                to: secondOwner.id,
                dialog: {
                    id: newDialog.id,
                    messages: [{
                        ...message,
                        ownerId: owner.id,
                        dialogId: newDialog.id
                    }],
                    status: 'CHAT',
                    info: {
                        id: owner.id,
                        image: owner.profile.avatar?.getFilePath() || null,
                        name: owner.profile.firstName + ' ' + owner.profile.lastName
                    },
                    users: validOwners.map(validOwner => ({
                        avatar: validOwner.profile.avatar?.getFilePath() || null,
                        firstName: validOwner.profile.firstName,
                        id: validOwner.id,
                        lastName: validOwner.profile.lastName,
                    }))
                }
            }
        ]

    }

    async updateDialog(
        user: UserEntity,
        { dialogId, ...dto }: UpdateDialogRequestDto,
    )/*: Promise<UpdateDialogResponseDto>*/ {
        const dialog = await this.dialogsRepository.findOne({ id: dialogId }, {relations: ['owners']});
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
            ownerId: owner.id,
            ...newMessage,
            dialogId,
        };
    }


    async getDialogs(user: UserEntity): Promise<GetDialogsResponseDto[]> {
        try {
            return this.dialogsRepository.getDialogsByUserId(user.id);
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    async getUserDialog(user: UserEntity, secondUserId: string)/*: Promise<{} | GetDialogResponseDto>*/ {
        const owner = await this.userRepository.findOne(user.id, {relations: ['profile', 'profile.avatar']});
        const secondOwner = await this.userRepository.findOne(secondUserId, {relations: ['profile', 'profile.avatar']});
        if (!owner || !secondOwner) {
            throw new BadRequestException(`Пользователя ${user.id} не существует`);
        }
        const dialogId = await this.findDialogId(owner.id, secondOwner.id)
        if (!dialogId) {
            return {
                id: null,
                messages: [],
                status: 'CHAT',
                info: {
                    id: secondOwner.id,
                    image: secondOwner.profile.avatar?.getFilePath() || null,
                    name: secondOwner.profile.firstName + ' ' + secondOwner.profile.lastName
                },
                users: [
                    {
                        avatar: secondOwner.profile.avatar?.getFilePath() || null,
                        firstName: secondOwner.profile.firstName,
                        id: secondOwner.id,
                        lastName: secondOwner.profile.lastName,
                    },
                    {
                        avatar: owner.profile.avatar?.getFilePath() || null,
                        firstName: owner.profile.firstName,
                        id: owner.id,
                        lastName: owner.profile.lastName,
                    }
                ]
            }
        }
        return this.dialogsRepository.getDialogByUsersId(user.id, secondOwner.id);
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

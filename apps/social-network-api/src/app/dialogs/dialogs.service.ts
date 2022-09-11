import { BadRequestException, Injectable } from '@nestjs/common';
import { DialogsRepository, MessagesEntity, MessagesRepository, UserEntity, UsersRepository } from '@app/nest-postgre';
import { FindManyOptions } from 'typeorm';
import { DialogsServiceInterface } from './interfaces/dialogs.service.interface';
import {
    UpdateDialogOwnersInterfaceArgs,
    UpdateDialogOwnersInterfaceReturn,
} from './interfaces/update-dialog-owners.interface';
import { GetUserDialogInterfaceReturn } from './interfaces/get-user-dialog.interface';
import { GetDialogsInterfaceReturn } from './interfaces/get-dialogs.interface';
import { UpdateDialogsInterfaceArgs, UpdateDialogsInterfaceReturn } from './interfaces/update-dialogs.interface';
import { CreateDialogInterfaceArgs, CreateDialogInterfaceReturn } from './interfaces/create-dialog.interface';

@Injectable()
export class DialogsService implements DialogsServiceInterface {
    constructor(
        private readonly dialogsRepository: DialogsRepository,
        private readonly userRepository: UsersRepository,
        private readonly messagesRepository: MessagesRepository,
    ) {
    }

    async validateOwners(owners: string[], options?: FindManyOptions<UserEntity>): Promise<UserEntity[]> {
        return this.userRepository.find({ where: owners.map(id => ({ id })), ...options });
    }

    async findDialogId(ownerId: string, secondOwnerId: string): Promise<string | null> {
        const owner = await this.userRepository.findOne({
            relations: ['dialogs', 'dialogs.owners'],
            where: { id: ownerId },
        });
        const secondOwner = await this.userRepository.findOne(secondOwnerId);
        if (!owner || !secondOwner) {
            throw new BadRequestException(`Пользователя не существует`);
        }
        let dialogId: null | string = null;

        for (const dialog of owner.dialogs) {
            const isFind: boolean[] = dialog.owners.map(userOwner => {
                return userOwner.id === owner.id || userOwner.id === secondOwner.id;
            });
            if (!isFind.some(e => !e)) {
                if (isFind.length === 1) {
                    if (owner.id === secondOwner.id) {
                        dialogId = dialog.id;
                        break;
                    }
                } else {
                    dialogId = dialog.id;
                    break;
                }
            }
        }
        return dialogId;
    }

    async createDialog(
        user: UserEntity,
        { secondOwnerId, ...messageData }: CreateDialogInterfaceArgs,
    ): Promise<CreateDialogInterfaceReturn[]> {
        const owner = await this.userRepository.findOne(
            user.id,
            { relations: ['profile', 'profile.avatar'] },
        );
        const secondOwner = await this.userRepository.findOne(
            secondOwnerId,
            { relations: ['profile', 'profile.avatar'] },
        );
        const validOwners = await this.validateOwners(
            [user.id, secondOwnerId],
            { relations: ['profile', 'profile.avatar'] },
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

        const userDialogs = [
            {
                to: owner.id,
                dialog: {
                    id: newDialog.id,
                    messages: [{
                        ...message,
                        ownerId: owner.id,
                        dialogId: newDialog.id,
                    }],
                    status: 'CHAT',
                    info: {
                        id: secondOwner.id,
                        image: secondOwner.profile.avatar?.getFilePath() || null,
                        name: secondOwner.profile.firstName + ' ' + secondOwner.profile.lastName,
                    },
                    users: validOwners.map(validOwner => ({
                        avatar: validOwner.profile.avatar?.getFilePath() || null,
                        firstName: validOwner.profile.firstName,
                        id: validOwner.id,
                        lastName: validOwner.profile.lastName,
                    })),
                },
            },
        ];

        if (owner.id !== secondOwner.id) {
            userDialogs.push({
                to: secondOwner.id,
                dialog: {
                    id: newDialog.id,
                    messages: [{
                        ...message,
                        ownerId: owner.id,
                        dialogId: newDialog.id,
                    }],
                    status: 'CHAT',
                    info: {
                        id: owner.id,
                        image: owner.profile.avatar?.getFilePath() || null,
                        name: owner.profile.firstName + ' ' + owner.profile.lastName,
                    },
                    users: validOwners.map(validOwner => ({
                        avatar: validOwner.profile.avatar?.getFilePath() || null,
                        firstName: validOwner.profile.firstName,
                        id: validOwner.id,
                        lastName: validOwner.profile.lastName,
                    })),
                },
            });
        }

        return userDialogs;
    }

    async updateDialog(
        user: UserEntity,
        { dialogId, text, ...dto }: UpdateDialogsInterfaceArgs,
    ): Promise<MessagesEntity> {
        const dialog = await this.dialogsRepository.findOne({ id: dialogId }, { relations: ['owners'] });
        if (!dialog) {
            throw new BadRequestException(`Диалог ${dialogId} отсутствует`);
        }
        const owner = await this.userRepository.findOne(user.id, { relations: ['profile', 'profile.avatar'] });
        if (!owner) {
            throw new BadRequestException(`Юзер ${user.id} отсутствует`);
        }
        return this.messagesRepository.saveAndGet(
            { owner, dialog, text},
        );
    }


    async getDialogs(user: UserEntity): Promise<GetDialogsInterfaceReturn[]> {
        try {
            const userDialogs = await this.userRepository.findOne(
                user.id,
                {
                    relations: [
                        'dialogs',
                        'dialogs.owners',
                        'dialogs.owners.profile',
                        'dialogs.owners.profile.avatar',
                    ],
                },
            );
            if (!userDialogs) {
                throw new BadRequestException('');
            }

            return Promise.all(
                userDialogs.dialogs.map(async dialog => {
                    let currentUser;

                    if (dialog.owners.length === 1) {
                        currentUser = dialog.owners[0];
                    } else {
                        dialog.owners.forEach(owner => {
                            if (owner.id !== user.id) {
                                currentUser = owner;
                            }
                        });
                    }

                    if (!currentUser) {
                        throw new BadRequestException('');
                    }

                    const lastMessage = await this.messagesRepository.findOne({
                        where: { dialog: dialog },
                        order: {
                            createdAt: 'DESC',
                        },
                        relations: ['owner'],
                    });

                    if (!lastMessage) {
                        throw new BadRequestException('');
                    }

                    return {
                        id: dialog.id,
                        info: {
                            id: currentUser.id,
                            name: currentUser.profile.firstName + ' ' + currentUser.profile.lastName,
                            image: currentUser.profile.avatar?.getFilePath() || null,
                        },
                        users: dialog.owners.map(owner => ({
                            id: owner.id,
                            avatar: owner.profile.avatar?.getFilePath() || null,
                            lastName: owner.profile.lastName,
                            firstName: owner.profile.firstName,
                        })),
                        status: dialog.status,
                        userId: currentUser.id,
                        lastMessage: {
                            id: lastMessage.id,
                            text: lastMessage.text,
                            ownerId: lastMessage.owner.id,
                            createdAt: lastMessage.createdAt,
                            updatedAt: lastMessage.updatedAt,
                        },
                    };
                }),
            );
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    async getUserDialog(user: UserEntity, secondUserId: string): Promise<GetUserDialogInterfaceReturn> {
        const owner = await this.userRepository.findOne(user.id, { relations: ['profile', 'profile.avatar'] });
        const secondOwner = await this.userRepository
            .findOne(secondUserId, { relations: ['profile', 'profile.avatar'] });
        if (!owner || !secondOwner) {
            throw new BadRequestException(`Пользователя ${user.id} не существует`);
        }
        const dialogId = await this.findDialogId(owner.id, secondOwner.id);
        let messages;
        if (dialogId) {
            messages = await this.messagesRepository.find({
                where: { dialog: dialogId },
                relations: ['owner', 'dialog'],
                order: {
                    createdAt: 'DESC',
                },
            });
        }


        return {
            id: dialogId,
            messages: messages?.map(message => ({
                id: message.id,
                text: message.text,
                ownerId: message.owner.id,
                createdAt: message.createdAt,
                updatedAt: message.updatedAt,
            })) || [],
            status: 'CHAT',
            info: {
                id: secondOwner.id,
                image: secondOwner.profile.avatar?.getFilePath() || null,
                name: secondOwner.profile.firstName + ' ' + secondOwner.profile.lastName,
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
                },
            ],
        };
    }

    async updateDialogOwners(
        user: UserEntity,
        { dialogId, owners }: UpdateDialogOwnersInterfaceArgs,
    ): Promise<UpdateDialogOwnersInterfaceReturn | undefined> {
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

import { IsOptional, IsString } from 'class-validator';
import { DialogsEntity, UserEntity } from '@app/nest-postgre';

export interface UpdateDialogsInterfaceArgs {
    text: string;
    dialogId: string;
    image: string;
    file: string;
}

export interface UpdateDialogsInterfaceReturn {
    dialogId: string,
    user: {
        id: string,
        avatar: string | null,
        lastName: string,
        firstName: string
    }
    id: string
    dialog: DialogsEntity
    text: string
    owner: UserEntity
    file: string
    image: string
    createdAt: Date
    updatedAt: Date
}

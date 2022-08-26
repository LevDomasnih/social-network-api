import { IsOptional, IsString } from 'class-validator';
import { DialogsEntity, FilesEntity, UserEntity } from '@app/nest-postgre';

export interface UpdateDialogsInterfaceArgs {
    text: string;
    dialogId: string;
    image: FilesEntity;
    file: FilesEntity;
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
    file: FilesEntity
    image: FilesEntity
    createdAt: Date
    updatedAt: Date
}

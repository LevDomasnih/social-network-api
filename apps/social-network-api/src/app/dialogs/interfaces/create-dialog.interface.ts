import { DialogsEntity, FilesEntity, UserEntity } from '@app/nest-postgre';

export interface CreateDialogInterfaceArgs {
    text: string;
    secondOwnerId: string;
    image: FilesEntity;
    file: FilesEntity;
}

export interface CreateDialogInterfaceReturn {
    to: string
    dialog: {
        id: string,
        messages: {
            id: string,
            updatedAt: Date,
            createdAt: Date,
            dialog: DialogsEntity,
            owner: UserEntity,
            text: string,
            image: FilesEntity,
            file: FilesEntity,
            ownerId: string,
            dialogId: string,
        }[]
        status: string,
        info: {
            id: string,
            image: string | null,
            name: string
        },
        users: {
            id: string,
            avatar: string | null,
            firstName: string,
            lastName: string,
        }[]
    }
}

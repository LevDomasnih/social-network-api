import { DialogsEntity, UserEntity } from '@app/nest-postgre';

export interface CreateDialogInterfaceArgs {
    text: string;
    secondOwnerId: string;
    image: string;
    file: string;
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
            image: string,
            file: string,
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

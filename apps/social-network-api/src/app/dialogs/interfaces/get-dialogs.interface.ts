import { DialogType } from '@app/nest-postgre';

export interface GetDialogsInterfaceArgs {

}

export interface GetDialogsInterfaceReturn {
    id: string;
    userId: string;
    lastMessage: {
        id: string;
        text: string;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    };
    status: DialogType;
    info: {
        id: string;
        image: string | null;
        name: string;
    };
    users: {
        id: string;
        avatar: string | null;
        firstName: string;
        lastName: string;
    }[];
}

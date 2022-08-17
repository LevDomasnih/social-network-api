export interface GetUserDialogInterfaceReturn {
    id: string | null;
    messages: {
        id: string;
        text: string;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    }[];
    status: string;
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

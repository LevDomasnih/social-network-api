import { FindManyOptions } from 'typeorm';
import { UserEntity } from '@app/nest-postgre';
import { CreateDialogInterfaceArgs, CreateDialogInterfaceReturn } from './create-dialog.interface';
import { UpdateDialogsInterfaceArgs, UpdateDialogsInterfaceReturn } from './update-dialogs.interface';
import { GetDialogsInterfaceReturn } from './get-dialogs.interface';
import { GetUserDialogInterfaceReturn } from './get-user-dialog.interface';
import { UpdateDialogOwnersInterfaceArgs, UpdateDialogOwnersInterfaceReturn } from './update-dialog-owners.interface';

export interface DialogsServiceInterface {
    validateOwners(owners: string[], options?: FindManyOptions<UserEntity>): Promise<UserEntity[]>;
    findDialogId(ownerId: string, secondOwnerId: string): Promise<string | null>;
    createDialog(user: UserEntity, data: CreateDialogInterfaceArgs): Promise<CreateDialogInterfaceReturn[]>
    // updateDialog(user: UserEntity, data: UpdateDialogsInterfaceArgs): Promise<UpdateDialogsInterfaceReturn>
    getDialogs(user: UserEntity): Promise<GetDialogsInterfaceReturn[]>
    getUserDialog(user: UserEntity, secondUserId: string): Promise<GetUserDialogInterfaceReturn>
    updateDialogOwners(
        user: UserEntity,
        data: UpdateDialogOwnersInterfaceArgs
    ): Promise<UpdateDialogOwnersInterfaceReturn | undefined>
}

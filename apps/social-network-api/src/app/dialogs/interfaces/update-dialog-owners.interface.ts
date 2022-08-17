import { DialogsEntity } from '@app/nest-postgre';

export interface UpdateDialogOwnersInterfaceArgs {
    dialogId: string;
    owners: string[];
}

export interface UpdateDialogOwnersInterfaceReturn extends DialogsEntity {

}

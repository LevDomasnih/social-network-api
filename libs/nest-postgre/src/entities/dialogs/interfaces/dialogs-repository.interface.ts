import { DialogsEntity } from '@app/nest-postgre/entities';

export interface DialogsRepositoryInterface {
    getDialogById(id: string): Promise<DialogsEntity | undefined>
    getDialogByUser(userConsumerId: string, userConsumedId: string): Promise<DialogsEntity | undefined>
    getDialogs(id: string): Promise<DialogsEntity[]>
}

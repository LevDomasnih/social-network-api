import { DialogsEntity } from '@app/nest-postgre/entities';
import { DialogInfoSchema } from '@app/graphql-lib/schemes/dialog-info.schema';

export interface DialogsRepositoryInterface {
    getDialogById(id: string): Promise<DialogsEntity | undefined>
    getDialogByUser(userConsumerId: string, userConsumedId: string): Promise<DialogsEntity | undefined>
    getDialogs(id: string): Promise<DialogsEntity[]>
    getInfo(dialogId: string, userConsumerId: string): Promise<DialogInfoSchema | undefined>
}

import { MessagesEntity } from '@app/nest-postgre/entities';

export interface MessagesRepositoryInterface {
    getLastMessage(dialogId: string): Promise<MessagesEntity | undefined>,
    getMessages(dialogId: string): Promise<MessagesEntity[]>,
}

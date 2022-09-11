import { MessagesEntity } from './messages.entity'
import { EntityRepository } from 'typeorm';
import { BaseRepository, MessagesRepositoryInterface } from '@app/nest-postgre/entities';

@EntityRepository(MessagesEntity)
export class MessagesRepository extends BaseRepository<MessagesEntity> implements MessagesRepositoryInterface {
    getLastMessage(dialogId: string): Promise<MessagesEntity | undefined> {
        return this.findOne({
            where: {
                dialog: {
                    id: dialogId
                }
            },
            order: {
                createdAt: 'DESC',
            },
            relations: ['owner', 'dialog'],
        });
    }

    getMessages(dialogId: string): Promise<MessagesEntity[]> {
        return this.find({
            where: {
                dialog: {
                    id: dialogId
                }
            },
            relations: ['owner', 'dialog'],
            order: {
                createdAt: 'DESC',
            },
        });
    }

}

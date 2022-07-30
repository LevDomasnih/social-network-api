import { MessagesEntity } from './messages.entity'
import { EntityRepository } from 'typeorm';
import { BaseRepository, MessagesRepositoryInterface } from '@app/nest-postgre/entities';

@EntityRepository(MessagesEntity)
export class MessagesRepository extends BaseRepository<MessagesEntity> implements MessagesRepositoryInterface {

}

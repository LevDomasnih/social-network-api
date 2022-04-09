import { MessagesEntity } from './messages.entity';
import { MessagesRepositoryInterface } from './interfaces/messages-repository.interface';
import { EntityRepository } from 'typeorm';
import { BaseRepository } from '../../common/repositories/base/base.repository';

@EntityRepository(MessagesEntity)
export class MessagesRepository extends BaseRepository<MessagesEntity> implements MessagesRepositoryInterface {

}

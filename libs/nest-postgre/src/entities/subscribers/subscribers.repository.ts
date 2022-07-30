import { SubscribersEntity } from './subscribers.entity'
import { EntityRepository } from 'typeorm';
import { BaseRepository, SubscribersRepositoryInterface } from '@app/nest-postgre/entities';

@EntityRepository(SubscribersEntity)
export class SubscribersRepository extends BaseRepository<SubscribersEntity> implements SubscribersRepositoryInterface {

}

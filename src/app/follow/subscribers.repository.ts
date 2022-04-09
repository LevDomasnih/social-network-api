import { SubscribersEntity } from './subscribers.entity';
import { SubscribersRepositoryInterface } from './interfaces/subscribers-repository.interface';
import { EntityRepository } from 'typeorm';
import { BaseRepository } from '../../common/repositories/base/base.repository';

@EntityRepository(SubscribersEntity)
export class SubscribersRepository extends BaseRepository<SubscribersEntity> implements SubscribersRepositoryInterface {

}

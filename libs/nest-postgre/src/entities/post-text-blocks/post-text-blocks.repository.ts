import { PostTextBlocksEntity } from './post-text-blocks.entity'
import { BaseRepository, PostTextBlocksRepositoryInterface } from '@app/nest-postgre/entities';
import { EntityRepository } from 'typeorm';

@EntityRepository(PostTextBlocksEntity)
export class PostTextBlocksRepository extends BaseRepository<PostTextBlocksEntity>
    implements PostTextBlocksRepositoryInterface {

}
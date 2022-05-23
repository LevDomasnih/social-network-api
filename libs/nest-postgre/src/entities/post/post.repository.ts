import { EntityRepository } from 'typeorm';
import { PostEntity } from './post.entity';
import { BaseRepository, PostRepositoryInterface } from '@app/nest-postgre/entities';

@EntityRepository(PostEntity)
export class PostRepository extends BaseRepository<PostEntity> implements PostRepositoryInterface {

}

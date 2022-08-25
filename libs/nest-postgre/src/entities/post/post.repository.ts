import { EntityRepository } from 'typeorm';
import { PostEntity } from './post.entity';
import { BaseRepository, PostRepositoryInterface } from '@app/nest-postgre/entities';

@EntityRepository(PostEntity)
export class PostRepository extends BaseRepository<PostEntity> implements PostRepositoryInterface {
    async getPostById(id: string): Promise<PostEntity | undefined> {
        return this.findOne({
            where: { id },
            order: {
                createdAt: 'DESC',
            },
            relations: ['owner', 'images', 'files'],
        });
    }

    async getPostsByUser(id: string): Promise<PostEntity[]> {
        return this.find({
            where: {
                owner: { id }
            },
            order: {
                createdAt: 'DESC',
            },
            relations: ['owner', 'images', 'files'],
        });
    }

    async getChildrenPosts(id: string): Promise<PostEntity[]> {
        return this.find({
            where: {
                parentPost: {
                    id
                }
            },
            order: {
                createdAt: 'DESC',
            },
            relations: ['owner'],
        });
    }

    async getParentPost(id: string): Promise<PostEntity | undefined> {
        return (await this.findOne({
            where: {
                id
            },
            order: {
                createdAt: 'DESC',
            },
            relations: ['owner', 'parentPost'],
        }))?.parentPost
    }
}

import { BlogTextBlockEntity } from './blog-text-block.entity';
import { BaseRepository, BlogTextBlockRepositoryInterface } from '@app/nest-postgre/entities';
import { EntityRepository } from 'typeorm';

@EntityRepository(BlogTextBlockEntity)
export class BlogTextBlockRepository extends BaseRepository<BlogTextBlockEntity>
    implements BlogTextBlockRepositoryInterface {
    async getBlogTextBlocksByBlog(blogId: string) {
        return this.find({
                where: {
                    postOwner: blogId,
                },
                order: {
                    createdAt: 'DESC',
                },
            },
        );
    }
}

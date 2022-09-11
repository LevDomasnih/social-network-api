import { BlogTextBlockEntity } from '@app/nest-postgre/entities';

export interface BlogTextBlockRepositoryInterface {
    getBlogTextBlocksByBlog(blogId: string): Promise<BlogTextBlockEntity[]>;
}

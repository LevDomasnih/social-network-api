import { BlogEntity, BlogModel } from '@app/nest-postgre/entities';

export interface BlogRepositoryInterface {
    getBlogsAndCommentsByUserId(userId: string): Promise<BlogModel[]>,
    getBlogsByUser(userId: string): Promise<BlogEntity[]>
}

import { PostEntity } from '@app/nest-postgre/entities';

export interface PostRepositoryInterface {
    getPostById(id: string): Promise<PostEntity | undefined>,
    getPostsByUser(id: string): Promise<PostEntity[]>,
    getParentPost(id: string): Promise<PostEntity | undefined>,
    getChildrenPosts(id: string): Promise<PostEntity[]>,
}

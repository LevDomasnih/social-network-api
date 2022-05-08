import { PostsWithCommentsModel } from '@app/nest-postgre/entities';

export interface PostsRepositoryInterface {
    getPostsAndCommentsByUserId(userId: string): Promise<PostsWithCommentsModel[]>
}

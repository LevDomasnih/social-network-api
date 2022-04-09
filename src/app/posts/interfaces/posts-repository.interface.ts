import { PostsWithCommentsModel } from '../models/posts-with-comments-model';

export interface PostsRepositoryInterface {
    getPostsAndCommentsByUserId(userId: string): Promise<PostsWithCommentsModel[]>
}

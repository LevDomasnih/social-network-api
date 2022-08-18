import { GetPostInterface } from './get-post.interface';
import { GetPostsInterface } from './get-posts.interface';
import { UserEntity } from '@app/nest-postgre';
import { CreatePostInterfaceDto, CreatePostInterfaceReturn } from './create-post.interface';

export interface PostsServiceInterface {
    getPost(postId: string): Promise<GetPostInterface | undefined>
    getPosts(userId: string): Promise<GetPostsInterface[]>
    createPost(user: UserEntity, dto: CreatePostInterfaceDto): Promise<CreatePostInterfaceReturn>
    changeLike(user: UserEntity, postId: string): Promise<GetPostInterface | undefined>
}

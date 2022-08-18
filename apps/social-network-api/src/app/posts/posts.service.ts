import { BadRequestException, Injectable } from '@nestjs/common';
import { PostRepository, UserEntity, UsersRepository } from '@app/nest-postgre';
import { GetPostsInterface } from './interfaces/get-posts.interface';
import { CreatePostInterfaceDto, CreatePostInterfaceReturn } from './interfaces/create-post.interface';
import { GetPostInterface } from './interfaces/get-post.interface';
import { PostsServiceInterface } from './interfaces/posts.service.interface';

@Injectable()
export class PostsService implements PostsServiceInterface {
    private readonly url = process.env.API_URL || 'http://localhost:3000';

    constructor(
        private readonly postRepository: PostRepository,
        private readonly usersRepository: UsersRepository,
    ) {
    }

    getPost(postId: string): Promise<GetPostInterface | undefined> {
        return this.postRepository.findOne({
            where: { id: postId },
            order: {
                createdAt: 'DESC',
            },
            relations: ['owner', 'owner.profile', 'owner.profile.avatar'],
        });
    }

    async getPosts(userId: string): Promise<GetPostsInterface[]> {
        const user = await this.usersRepository.findOne(userId);
        if (!user) {
            throw new BadRequestException('Отсутствует пользователь'); // TODO ПРОДУМАТЬ ОШИБКИ
        }
        const posts = await this.postRepository.find({
            where: { owner: user },
            order: {
                createdAt: 'DESC',
            },
            relations: ['owner', 'owner.profile', 'owner.profile.avatar'],
        });
        return posts.map(post => ({
            id: post.id,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            likes: post.likes.length,
            isLiked: post.likes.includes(user.id),
            views: post.views.length,
            text: post.text,
            profile: {
                avatar: post.owner.profile.avatar?.folder ?
                    (this.url + '/' +
                        post.owner.profile.avatar.folder + '/' +
                        post.owner.profile.avatar.name) : null,
                firstName: post.owner.profile.firstName,
                lastName: post.owner.profile.lastName,
            },
        }));
    }

    async createPost(user: UserEntity, dto: CreatePostInterfaceDto): Promise<CreatePostInterfaceReturn> {
        return this.postRepository.save({ // TODO СДЕЛАТЬ СТАТУСЫ ПО СОЗДАНИЮ И РЕДАКТИРОВАНИЮ
            owner: user,
            text: dto.text,
            parentPosts: dto.parentPost ? await (this.postRepository.findOne(dto.parentPost)) : null,
        });
    }

    async changeLike(user: UserEntity, postId: string): Promise<GetPostInterface | undefined> {
        const post = await this.postRepository.findOne(postId);
        let likes;
        if (!post) {
            throw new BadRequestException('Нет поста');
        }

        if (post.likes.includes(user.id)) {
            likes = post.likes.filter(e => e !== user.id);
        } else {
            likes = [...post.likes, user.id];
        }

        await this.postRepository.update(postId, {
            likes: likes,
        });

        return this.getPost(postId);
    }
}

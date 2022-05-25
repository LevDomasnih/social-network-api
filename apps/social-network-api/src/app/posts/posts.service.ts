import { BadRequestException, Injectable } from '@nestjs/common';
import { PostRepository, UserEntity, UsersRepository } from '@app/nest-postgre';
import { CreatePostDto } from './dto/create-post/create-post.dto';
import { GetPostsDto } from './dto/get-posts/get-posts.dto';

@Injectable()
export class PostsService {
    private readonly url = process.env.API_URL || 'http://localhost:3000';
    constructor(
        private readonly postRepository: PostRepository,
        private readonly usersRepository: UsersRepository
    ) {
    }

    getPost(postId: string) {
        return this.postRepository.findOne(postId)
    }

    async getPosts(userId: string): Promise<GetPostsDto[] | BadRequestException> {
        const user = await this.usersRepository.findOne(userId)
        if (!user) {
            return new BadRequestException('Отсутствует пользователь') // TODO ПРОДУМАТЬ ОШИБКИ
        }
        const posts = await this.postRepository.find({
            where: {owner: user},
            order: {
                updatedAt: 'DESC'
            },
            relations: ['owner', 'owner.profile', 'owner.profile.avatar']
        })
        return posts.map(post => ({
            id: post.id,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            likes: post.likes,
            views: post.views,
            text: post.text,
            profile: {
                avatar: post.owner.profile.avatar?.folder ?
                    (this.url + '/' +
                    post.owner.profile.avatar.folder + '/' +
                    post.owner.profile.avatar.name) : null,
                firstName: post.owner.profile.firstName,
                lastName: post.owner.profile.lastName,
            }
        }))
    }

    async createPost(user: UserEntity, dto: CreatePostDto) {
        return this.postRepository.save({ // TODO СДЕЛАТЬ СТАТУСЫ ПО СОЗДАНИЮ И РЕДАКТИРОВАНИЮ
            owner: user,
            text: dto.text,
            parentPosts: dto.parentPost ? await (this.postRepository.findOne(dto.parentPost)) : null
        })
    }
}

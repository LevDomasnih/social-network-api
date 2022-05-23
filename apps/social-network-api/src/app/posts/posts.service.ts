import { Injectable } from '@nestjs/common';
import { PostRepository, UserEntity } from '@app/nest-postgre';
import { CreatePostDto } from './dto/create-post/create-post.dto';

@Injectable()
export class PostsService {
    constructor(
        private readonly postRepository: PostRepository
    ) {
    }

    getPost(postId: string) {
        return this.postRepository.findOne(postId)
    }

    async createPost(user: UserEntity, dto: CreatePostDto) {
        return this.postRepository.save({
            owner: user,
            text: dto.text,
            parentPosts: dto.parentPost ? await (this.postRepository.findOne(dto.parentPost)) : null
        })
    }
}

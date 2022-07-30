import { Injectable } from '@nestjs/common';
import { Express } from 'express';
import {
    BlogRepository,
    BlogTextBlockRepository,
    FilesRepository,
    UserEntity,
    UsersRepository,
} from '@app/nest-postgre';
import { CreateBlogRequestDto } from './dto';
import { UpdateProfileFileContract } from '@app/amqp-contracts';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class BlogsService {
    private readonly url = process.env.API_URL || 'http://localhost:3000';
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly postRepository: BlogRepository,
        private readonly amqpConnection: AmqpConnection,
        private readonly filesRepository: FilesRepository,
        private readonly blogTextBlockRepository: BlogTextBlockRepository,
    ) {
    }

    // async saveTempPostFiles(
    //     user: UserEntity,
    //     files: Express.Multer.File[],
    // ) {
    //     const paths: Array<string> = []
    //
    //     for (const file of files) {
    //         const newFile = await this.amqpConnection.request<UpdateProfileFileContract.ResponsePayload>({
    //             exchange: UpdateProfileFileContract.queue.exchange,
    //             routingKey: UpdateProfileFileContract.queue.routingKey,
    //             payload: {
    //                 buffer: file.buffer,
    //                 user: user,
    //                 fileField: 'post-created', //FIXME uuid с фронта??
    //                 folder: FolderName.TEMP,
    //                 status: Status.PROLONG,
    //                 lastProlong: add(new Date(), { minutes: 5 })
    //             },
    //         });
    //         paths.push(this.url + '/' + newFile.name)
    //     }
    //
    //     return paths
    // }

    async createBlog(
        user: UserEntity,
        files: Express.Multer.File[],
        dto: CreateBlogRequestDto,
    )/*: Promise<CreatePostResponseDto> */{

        const newFile = await this.amqpConnection.request<UpdateProfileFileContract.ResponsePayload>({
            exchange: UpdateProfileFileContract.queue.exchange,
            routingKey: UpdateProfileFileContract.queue.routingKey,
            payload: {
                buffer: files[0].buffer,
                user: user,
                fileField: 'post', //FIXME post hash
            },
        });


        const image = await this.filesRepository.save({
            owner: user,
            ...newFile,
        });

        // TODO RX??
        const headers = dto.textBlocks
            .filter(block => block.type.includes('header'))
            .map(block => block.text)

        const newPost = await this.postRepository.save({
            owner: user,
            headers,
            mainImage: image,
            entityMap: dto.entityMap
        })
        for (const block of dto.textBlocks) {
            await this.blogTextBlockRepository.save({
                postOwner: newPost,
                key: block.key,
                data: block.data,
                depth: block.depth,
                entityRanges: block.entityRanges,
                inlineStyleRanges: block.inlineStyleRanges,
                text: block.text,
                type: block.type
            })
        }

        return this.postRepository.getBlogsAndCommentsByUserId(user.id)
            .then(posts => posts
                .sort((postPrev, postNext) =>
                    new Date(postNext.createdAt).getTime() - new Date(postPrev.createdAt).getTime()))
    }

    async deleteBlog(user: UserEntity, postId: string) {
        const deleteResult = await this.postRepository.delete({owner: user, id: postId})
        return deleteResult.affected // FIXME добавить структуру к удалению
    }

    // async createComment(
    //     user: UserEntity, parentId: string,
    //     file: Express.Multer.File, dto: CreateCommentRequestDto,
    // ): Promise<CreateCommentResponseDto> {
    //     const parentPost = await this.postRepository.findOne({ id: parentId });
    //     if (!parentPost) {
    //         throw new BadRequestException('Пост не существует');
    //     }
    //     return this.postRepository.saveAndGet({
    //         image: file?.filename || '',
    //         owner: await this.usersRepository.findOne(user.id),
    //         ...dto,
    //         parentPosts: parentPost,
    //     }, {}, { relations: ['owner'] });
    // }

    // async updatePost(
    //     user: UserEntity, postId: string,
    //     file: Express.Multer.File, { text }: CreateBlogRequestDto,
    // ): Promise<UpdateBlogResponseDto> {
    //     const oldPost = await this.postRepository.findOne({ id: postId });
    //     const oldImageName = oldPost?.image;
    //     if (oldImageName) {
    //         await unlink(`files/${oldImageName}`);
    //     }
    //     const updatedPost = await this.postRepository.update(
    //         { id: postId },
    //         {
    //             text,
    //             image: file.filename,
    //         },
    //     );
    //     if (!updatedPost.affected) {
    //         throw new BadRequestException('Пост не был обновлен');
    //     }
    //     return {
    //         updated: updatedPost.affected === 1,
    //     }; // TODO
    // }

    async getPost() {

    }

    async getBlogsOfUser(userId: string) {
        return this.postRepository.getBlogsAndCommentsByUserId(userId)
            .then(posts => posts
                .sort((postPrev, postNext) =>
                    new Date(postNext.createdAt).getTime() - new Date(postPrev.createdAt).getTime()))
    }

    async getPosts() {

    }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import {
    BlogEntity,
    BlogRepository,
    BlogTextBlockRepository,
    FilesRepository,
    UserEntity,
    UsersRepository,
} from '@app/nest-postgre';
import { UpdateProfileFileContract } from '@app/amqp-contracts';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { IFileUpload } from '@app/common/model/file-upload.interface';
import { CreateBlogDto } from './dto';
import { CreateBlogScheme } from './schemes';
import { DeleteBlogScheme } from './schemes/delete-blog.scheme';

@Injectable()
export class BlogsService {
    private readonly url = process.env.API_URL || 'http://localhost:3000';

    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly blogRepository: BlogRepository,
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
        files: IFileUpload[],
        dto: CreateBlogDto,
    ): Promise<BlogEntity> {

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
            .map(block => block.text);

        const newBlog = await this.blogRepository.save({
            owner: user,
            headers,
            mainImage: image,
            entityMap: dto.entityMap,
        });
        for (const block of dto.textBlocks) {
            await this.blogTextBlockRepository.save({
                postOwner: newBlog,
                key: block.key,
                data: block.data,
                depth: block.depth,
                entityRanges: block.entityRanges,
                inlineStyleRanges: block.inlineStyleRanges,
                text: block.text,
                type: block.type,
            });
        }

        const blog = await this.blogRepository.findOne(newBlog.id, {relations: ['owner', 'mainImage']})

        if (!blog) {
            throw new BadRequestException('Блог не создался')
        }

        return blog
    }

    async deleteBlog(user: UserEntity, postId: string): Promise<DeleteBlogScheme> {
        const deleteResult = await this.blogRepository.delete({ owner: user, id: postId });
        return {
            deleted: !!deleteResult.affected,
        }; // FIXME добавить структуру к удалению
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
}

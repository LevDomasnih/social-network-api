import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import {
    FilesEntity,
    FilesRepository,
    MessagesEntity,
    MessagesRepository,
    UserEntity,
    UsersRepository,
} from '@app/nest-postgre';

@Resolver(() => MessagesEntity)
export class MessagesResolver {

    constructor(
        private readonly messagesRepository: MessagesRepository,
        private readonly usersRepository: UsersRepository,
        private readonly filesRepository: FilesRepository,
    ) {
    }

    @ResolveField(returns => UserEntity, { name: 'owner' })
    async getUser(
        @Parent() message: MessagesEntity,
    ) {
        return this.usersRepository.getUserById(message.owner.id);
    }

    @ResolveField(returns => FilesEntity, { name: 'image', nullable: true })
    async getImage(
        @Parent() message: MessagesEntity,
    ) {
        if (!message.image) {
            return null;
        }
        return this.filesRepository.getFile(message.image.id);
    }

    @ResolveField(returns => FilesEntity, { name: 'file', nullable: true })
    async getFile(
        @Parent() message: MessagesEntity,
    ) {
        if (!message.file) {
            return null;
        }
        return this.filesRepository.getFilePath(message.file.id);
    }
}

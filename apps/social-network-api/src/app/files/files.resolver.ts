import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { FilesEntity, FilesRepository, UserEntity, UsersRepository } from '@app/nest-postgre';

@Resolver(() => FilesEntity)
export default class FilesResolver {
    constructor(
        private readonly filesRepository: FilesRepository,
        private readonly usersRepository: UsersRepository,
    ) {
    }

    @ResolveField(returns => String, { name: 'filePath' })
    async getFile(
        @Parent() filesEntity: FilesEntity,
    ) {
        return this.filesRepository.getFilePath(filesEntity.id);
    }

    @ResolveField(returns => UserEntity, { name: 'owner' })
    async getUser(
        @Parent() filesEntity: FilesEntity,
    ) {
        return this.usersRepository.getUserById(filesEntity.owner.id);
    }
}

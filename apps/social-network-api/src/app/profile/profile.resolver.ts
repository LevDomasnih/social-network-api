import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import { IdValidationPipe } from '@app/common';
import { UseGuards } from '@nestjs/common';
import { JwtGqlGuard } from '../auth/guards/jwt-gql.guard';
import { UserGql } from '@app/common/decorators/user.gql.decorator';
import {
    FilesEntity,
    FilesRepository,
    ProfileEntity,
    ProfileRepository,
    UserEntity,
    UsersRepository,
} from '@app/nest-postgre';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { EditProfileInput } from './dto/edit-profile.input';
import gqlFileUploadConvert from '@app/common/helpers/gql-file-upload-convert';
import { EditProfileScheme } from './schemes/edit-profile.scheme';
import { EditImageScheme } from './schemes/edit-image.scheme';

@Resolver(() => ProfileEntity)
export class ProfileResolver {

    constructor(
        private readonly profileService: ProfileService,
        private readonly usersRepository: UsersRepository,
        private readonly profileRepository: ProfileRepository,
        private readonly filesRepository: FilesRepository,
    ) {
    }

    @Query(returns => ProfileEntity, { name: 'profile' })
    async getProfile(
        @Args('userId', IdValidationPipe) userId: string,
    ) {
        return this.profileRepository.getProfileByUserId(userId);
    }

    @ResolveField(returns => UserEntity, { name: 'owner' })
    async getUserBlogs(
        @Parent() profile: ProfileEntity,
    ) {
        return this.usersRepository.getUserById(profile.owner.id);
    }

    @ResolveField(returns => FilesEntity, { name: 'avatar' })
    async getAvatar(
        @Parent() profile: ProfileEntity,
    ) {
        return this.filesRepository.getFile(profile.avatar.id);
    }

    @ResolveField(returns => FilesEntity, { name: 'mainImage' })
    async getMainImage(
        @Parent() profile: ProfileEntity,
    ) {
        return this.filesRepository.getFile(profile.mainImage.id);
    }

    @Mutation(returns => EditProfileScheme)
    @UseGuards(JwtGqlGuard)
    async edit(
        @UserGql() user: UserEntity,
        @Args('data') dto: EditProfileInput,
    ) {
        return this.profileService.editProfile(user, dto);
    }

    @Mutation(returns => EditImageScheme)
    @UseGuards(JwtGqlGuard)
    async editImg(
        @UserGql() user: UserEntity,
        @Args('field') field: 'avatar' | 'mainImage',
        @Args({ name: 'files', type: () => [GraphQLUpload] }) fileUpload: Promise<FileUpload>[],
    ) {
        const filesAwaited = await Promise.all(fileUpload);
        const files = await gqlFileUploadConvert(filesAwaited);
        return this.profileService.editImage(files, user, field);
    }
}

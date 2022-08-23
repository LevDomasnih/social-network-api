import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import { IdValidationPipe } from '@app/common';
import { OnModuleInit, UseGuards } from '@nestjs/common';
import { JwtGqlGuard } from '../auth/guards/jwt-gql.guard';
import { UserGql } from '@app/common/decorators/user.gql.decorator';
import { BlogEntity, ProfileEntity, UserEntity } from '@app/nest-postgre';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { EditProfileInput } from './dto/edit-profile.input';
import gqlFileUploadConvert from '@app/common/helpers/gql-file-upload-convert';
import { EditProfileScheme } from './schemes/edit-profile.scheme';
import { EditImageScheme } from './schemes/edit-image.scheme';
import { UsersService } from '../users/users.service';
import { ModuleRef } from '@nestjs/core';

@Resolver(() => ProfileEntity)
export class ProfileResolver implements OnModuleInit {
    private usersService: UsersService;

    constructor(
        private readonly profileService: ProfileService,
        private readonly moduleRef: ModuleRef,
    ) {
    }

    onModuleInit() {
        this.usersService = this.moduleRef.get(UsersService, {strict: false});
    }

    @Query(returns => ProfileEntity)
    async get(
        @Args('userId', IdValidationPipe) userId: string,
    ) {
        return this.profileService.findProfile(userId);
    }

    @ResolveField(returns => UserEntity, {name: 'owner'})
    async getUserBlogs(
        @Parent() profile: ProfileEntity
    ) {
        return this.usersService.getUserById(profile.owner.id)
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

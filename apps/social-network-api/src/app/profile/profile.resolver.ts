import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import { IdValidationPipe } from '@app/common';
import { UseGuards } from '@nestjs/common';
import { JwtGqlGuard } from '../auth/guards/jwt-gql.guard';
import { UserGql } from '@app/common/decorators/user.gql.decorator';
import { UserEntity } from '@app/nest-postgre';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { EditProfileInput } from './dto/edit-profile.input';
import gqlFileUploadConvert from '@app/common/helpers/gql-file-upload-convert';
import { GetProfileScheme } from './schemes/get-profile.scheme';
import { EditProfileScheme } from './schemes/edit-profile.scheme';
import { EditImageScheme } from './schemes/edit-image.scheme';

@Resolver()
export class ProfileResolver {
    constructor(
        private readonly profileService: ProfileService,
    ) {
    }

    @Query(returns => GetProfileScheme)
    async get(
        @Args('userId', IdValidationPipe) userId: string,
    ) {
        return this.profileService.findProfile(userId);
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

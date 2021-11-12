import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PostsModel } from '../posts.model';
import { Ref } from '@typegoose/typegoose';
import { UserModel } from '../../users/user.model';

export class CreatePostResponseDto extends PartialType(PostsModel) {

    @ApiProperty({default: 'ownerId'})
    owner: Ref<UserModel>

    @ApiProperty({default: ['postId']})
    comments: Ref<PostsModel>[]
}
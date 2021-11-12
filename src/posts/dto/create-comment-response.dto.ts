import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PostsModel } from '../posts.model';
import { Ref } from '@typegoose/typegoose';
import { UserModel } from '../../users/user.model';

export class CreateCommentResponseDto extends PartialType(PostsModel) {
    @ApiProperty({default: 'ownerId'})
    owner: Ref<UserModel>
}
import { PartialType } from '@nestjs/swagger';
import { PostsModel } from '../posts.model';

export class GetUserPostsResponseDto extends PartialType(PostsModel) {}
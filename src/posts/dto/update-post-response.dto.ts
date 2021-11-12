import { PartialType } from '@nestjs/swagger';
import { PostsModel } from '../posts.model';

export class UpdatePostResponseDto extends PartialType(PostsModel) {}
import { IsString } from 'class-validator';

export class CreateCommentDto {

    @IsString()
    parentPost: string

    @IsString()
    text: string
}
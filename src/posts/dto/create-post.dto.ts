import { IsString } from 'class-validator';

export class CreatePostDto {

    @IsString()
    owner: string

    @IsString()
    text: string
}